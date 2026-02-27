import React, { useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { X, AlertCircle, ChevronDown, Search } from 'lucide-react';
import { Country, State } from 'country-state-city';
import ReactCountryFlag from 'react-country-flag';

const LABELS = ['Home', 'Office', 'Other'];

const EMPTY = {
    address_label: 'Home',
    recipient_name: '',
    recipient_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'MY',
    is_default: false,
};

// Pre-load + sort all countries once
const ALL_COUNTRIES = Country.getAllCountries().sort((a, b) =>
    a.name.localeCompare(b.name)
);

/* ─── Searchable Country Picker ─────────────────────────────────────────── */
function CountryPicker({ value, onChange, error }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    const selected = ALL_COUNTRIES.find(c => c.isoCode === value);

    const filtered = useMemo(() => {
        if (!search.trim()) return ALL_COUNTRIES;
        const q = search.toLowerCase();
        return ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(q));
    }, [search]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setSearch('');
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleSelect = (isoCode) => {
        onChange(isoCode);
        setOpen(false);
        setSearch('');
    };

    return (
        <div ref={wrapperRef} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={open ? () => { setOpen(false); setSearch(''); } : handleOpen}
                className={`flex items-center justify-between w-full px-3 py-2.5 border ${error ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-left`}
            >
                {selected ? (
                    <span className="flex items-center gap-2">
                        <ReactCountryFlag
                            countryCode={selected.isoCode}
                            svg
                            style={{ width: '1.25em', height: '1.25em', borderRadius: '2px' }}
                        />
                        <span className="text-gray-800">{selected.name}</span>
                    </span>
                ) : (
                    <span className="text-gray-400">Select country</span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* Search input */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search country…"
                            className="flex-1 text-sm outline-none placeholder-gray-400"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')}>
                                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    {/* Country list */}
                    <ul className="max-h-52 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">No countries found</li>
                        ) : (
                            filtered.map(c => (
                                <li key={c.isoCode}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(c.isoCode)}
                                        className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left hover:bg-red-50 transition-colors ${value === c.isoCode ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        <ReactCountryFlag
                                            countryCode={c.isoCode}
                                            svg
                                            style={{ width: '1.25em', height: '1.25em', borderRadius: '2px', flexShrink: 0 }}
                                        />
                                        <span>{c.name}</span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
/* ─────────────────────────────────────────────────────────────────────────── */

function AddressForm({ address, onSaved, onClose }) {
    const isEdit = !!address;

    const resolveCountryCode = (addr) => {
        if (!addr) return EMPTY.country;
        if (addr.country && addr.country.length === 2) return addr.country;
        const found = ALL_COUNTRIES.find(
            c => c.name.toLowerCase() === (addr.country || '').toLowerCase()
        );
        return found ? found.isoCode : 'MY';
    };

    const initialForm = isEdit
        ? { ...EMPTY, ...address, country: resolveCountryCode(address) }
        : { ...EMPTY };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const stateList = useMemo(
        () => State.getStatesOfCountry(form.country),
        [form.country]
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleCountryChange = (isoCode) => {
        setForm(prev => ({ ...prev, country: isoCode, state: '' }));
        if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const countryObj = ALL_COUNTRIES.find(c => c.isoCode === form.country);
        const payload = {
            ...form,
            country: countryObj ? countryObj.name : form.country,
        };

        try {
            let res;
            if (isEdit) {
                res = await axios.put(`/api/addresses/${address.address_id}`, payload);
            } else {
                res = await axios.post('/api/addresses', payload);
            }
            onSaved(res.data.addresses);
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setErrors({ general: err.response?.data?.message || 'Something went wrong.' });
        } finally {
            setSaving(false);
        }
    };

    const field = (name, label, props = {}) => (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`block w-full px-3 py-2.5 border ${errors[name] ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                {...props}
            />
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name][0]}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">
                        {isEdit ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
                    {errors.general && (
                        <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.general}
                        </div>
                    )}

                    {/* Label selector */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Address Label</label>
                        <div className="flex gap-2">
                            {LABELS.map(l => (
                                <button
                                    key={l} type="button"
                                    onClick={() => setForm(prev => ({ ...prev, address_label: l }))}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.address_label === l
                                        ? 'bg-red-600 border-red-600 text-white'
                                        : 'border-gray-300 text-gray-600 hover:border-red-400'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {field('recipient_name', 'Recipient Name *', { placeholder: 'Full name', required: true })}
                        {field('recipient_phone', 'Phone Number *', { placeholder: '+60 12-345 6789', type: 'tel', required: true })}
                    </div>

                    {field('address_line1', 'Address Line 1 *', { placeholder: 'House / Unit no, Street', required: true })}
                    {field('address_line2', 'Address Line 2', { placeholder: 'Building, floor, landmark (optional)' })}

                    <div className="grid grid-cols-2 gap-4">
                        {field('postcode', 'Postcode *', { placeholder: '50000', required: true })}
                        {field('city', 'City *', { placeholder: 'Kuala Lumpur', required: true })}
                    </div>

                    {/* Country — searchable picker */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Country *</label>
                        <CountryPicker
                            value={form.country}
                            onChange={handleCountryChange}
                            error={errors.country}
                        />
                        {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country[0]}</p>}
                    </div>

                    {/* State / Province */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            State / Province{stateList.length > 0 ? ' *' : ''}
                        </label>
                        {stateList.length > 0 ? (
                            <select
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                required
                                className={`block w-full px-3 py-2.5 border ${errors.state ? 'border-red-300' : 'border-gray-300'
                                    } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            >
                                <option value="">Select state / province</option>
                                {stateList.map(s => (
                                    <option key={s.isoCode} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="State / Region (optional)"
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        )}
                        {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state[0]}</p>}
                    </div>

                    {/* Default checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="is_default"
                            checked={form.is_default}
                            onChange={handleChange}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Set as default delivery address</span>
                    </label>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button type="button" onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                        {saving ? 'Saving…' : isEdit ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddressForm;
