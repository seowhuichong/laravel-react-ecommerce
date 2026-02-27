import React, { useState, useEffect } from 'react';
import AccountLayout from './AccountLayout';
import SEO from '../../components/SEO';
import axios from 'axios';
import { MapPin, Plus, Pencil, Trash2, Star, AlertCircle, Loader } from 'lucide-react';
import AddressForm from './AddressForm';

function Addresses() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editAddress, setEditAddress] = useState(null); // null = add new
    const [deletingId, setDeletingId] = useState(null);
    const [settingId, setSettingId] = useState(null);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('/api/addresses');
            setAddresses(res.data.addresses);
        } catch {
            setError('Could not load addresses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleSetDefault = async (id) => {
        setSettingId(id);
        try {
            const res = await axios.patch(`/api/addresses/${id}/set-default`);
            setAddresses(res.data.addresses);
        } catch {
            setError('Failed to update default address.');
        } finally {
            setSettingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this address?')) return;
        setDeletingId(id);
        try {
            const res = await axios.delete(`/api/addresses/${id}`);
            setAddresses(res.data.addresses);
        } catch {
            setError('Failed to delete address.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleFormSaved = (updatedAddresses) => {
        setAddresses(updatedAddresses);
        setShowForm(false);
        setEditAddress(null);
    };

    const openAdd = () => { setEditAddress(null); setShowForm(true); };
    const openEdit = (addr) => { setEditAddress(addr); setShowForm(true); };

    return (
        <AccountLayout>
            <SEO title="Saved Addresses" description="Manage your delivery addresses" path="/account/addresses" noIndex />

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Saved Addresses</h2>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Address
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-gray-400">
                            <Loader className="w-6 h-6 animate-spin mr-2" />
                            Loading addresses…
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">No saved addresses yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add a delivery address to get started.</p>
                            <button onClick={openAdd}
                                className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                                + Add First Address
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.address_id}
                                    className={`relative p-5 rounded-xl border-2 transition-colors ${addr.is_default
                                            ? 'border-red-400 bg-red-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    {/* Label + Default badge */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            {addr.address_label}
                                        </span>
                                        {addr.is_default && (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                                <Star className="w-3 h-3 fill-red-500" />
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    {/* Address details */}
                                    <p className="font-semibold text-gray-800 text-sm">{addr.recipient_name}</p>
                                    <p className="text-sm text-gray-500">{addr.recipient_phone}</p>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        {addr.address_line1}
                                        {addr.address_line2 && <>, {addr.address_line2}</>}
                                        <br />
                                        {addr.postcode} {addr.city}, {addr.state}
                                        <br />
                                        {addr.country}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                        {!addr.is_default && (
                                            <button
                                                onClick={() => handleSetDefault(addr.address_id)}
                                                disabled={settingId === addr.address_id}
                                                className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                                            >
                                                {settingId === addr.address_id ? 'Setting…' : 'Set as Default'}
                                            </button>
                                        )}
                                        <div className="ml-auto flex items-center gap-1">
                                            <button
                                                onClick={() => openEdit(addr)}
                                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(addr.address_id)}
                                                disabled={deletingId === addr.address_id}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Address Form Modal */}
            {showForm && (
                <AddressForm
                    address={editAddress}
                    onSaved={handleFormSaved}
                    onClose={() => { setShowForm(false); setEditAddress(null); }}
                />
            )}
        </AccountLayout>
    );
}

export default Addresses;
