import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';
import SEO from '../../components/SEO';
import axios from 'axios';
import { User, Mail, Phone, Calendar, Venus, AlertCircle, CheckCircle } from 'lucide-react';

function Profile() {
    const { user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        gender: user?.gender ?? '',
        date_of_birth: user?.date_of_birth ? user.date_of_birth.substring(0, 10) : '',
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [pwErrors, setPwErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (pwErrors[name]) setPwErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setSuccess('');
        try {
            const res = await axios.put('/api/profile', formData);
            // Update the global auth user so sidebar/header reflect instantly
            const saved = res.data?.user ?? formData;
            updateUser({ name: saved.name, email: saved.email });
            setSuccess('Profile updated successfully.');
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setErrors({ general: err.response?.data?.message || 'Something went wrong.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPwSaving(true);
        setPwErrors({});
        setPwSuccess('');
        try {
            await axios.put('/api/profile/password', passwordData);
            setPwSuccess('Password changed successfully.');
            setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            if (err.response?.data?.errors) setPwErrors(err.response.data.errors);
            else setPwErrors({ general: err.response?.data?.message || 'Something went wrong.' });
        } finally {
            setPwSaving(false);
        }
    };

    const inputClass = (field, errs = errors) =>
        `block w-full pl-10 pr-3 py-2.5 border ${errs[field] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
        } rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent`;

    const FieldIcon = ({ icon: Icon }) => (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
        </div>
    );

    return (
        <AccountLayout>
            <SEO title="My Profile" description="Manage your account information" path="/account/profile" noIndex />

            <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">Personal Information</h2>

                    {success && (
                        <div className="mb-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            {success}
                        </div>
                    )}
                    {errors.general && (
                        <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                            <div className="relative">
                                <FieldIcon icon={User} />
                                <input name="name" type="text" value={formData.name} onChange={handleChange}
                                    className={inputClass('name')} placeholder="John Doe" />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                            <div className="relative">
                                <FieldIcon icon={Mail} />
                                <input name="email" type="email" value={formData.email} onChange={handleChange}
                                    className={inputClass('email')} placeholder="you@example.com" />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                            <div className="relative">
                                <FieldIcon icon={Phone} />
                                <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                    className={inputClass('phone')} placeholder="+60 12-345 6789" />
                            </div>
                            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone[0]}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth</label>
                            <div className="relative">
                                <FieldIcon icon={Calendar} />
                                <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange}
                                    className={inputClass('date_of_birth')} />
                            </div>
                            {errors.date_of_birth && <p className="mt-1 text-xs text-red-600">{errors.date_of_birth[0]}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                            <div className="relative">
                                <FieldIcon icon={Venus} />
                                <select name="gender" value={formData.gender} onChange={handleChange}
                                    className={inputClass('gender')}>
                                    <option value="">Prefer not to say</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                            <button type="submit" disabled={saving}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">Change Password</h2>

                    {pwSuccess && (
                        <div className="mb-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            {pwSuccess}
                        </div>
                    )}
                    {pwErrors.general && (
                        <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {pwErrors.general}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                            <input name="current_password" type="password" value={passwordData.current_password}
                                onChange={handlePwChange}
                                className={`block w-full px-3 py-2.5 border ${pwErrors.current_password ? 'border-red-300' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                placeholder="••••••••" />
                            {pwErrors.current_password && <p className="mt-1 text-xs text-red-600">{pwErrors.current_password[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                            <input name="password" type="password" value={passwordData.password}
                                onChange={handlePwChange}
                                className={`block w-full px-3 py-2.5 border ${pwErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                placeholder="Min. 8 characters" />
                            {pwErrors.password && <p className="mt-1 text-xs text-red-600">{pwErrors.password[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
                            <input name="password_confirmation" type="password" value={passwordData.password_confirmation}
                                onChange={handlePwChange}
                                className={`block w-full px-3 py-2.5 border ${pwErrors.password_confirmation ? 'border-red-300' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                                placeholder="Re-enter new password" />
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                            <button type="submit" disabled={pwSaving}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                {pwSaving ? 'Updating…' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AccountLayout>
    );
}

export default Profile;
