import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Upload, MapPin, Check, Loader2, User, Building2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RegistrationModal = ({ isOpen, onClose, onRegistrationSuccess }) => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('donor'); // 'donor', 'recipient', 'volunteer'
    const [loading, setLoading] = useState(false);
    const [registeredId, setRegisteredId] = useState(null);



    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        address: '',
        organizationName: '',
        panNumber: '',
        aadhaarNumber: '',
        phone: '',
        email: '',
        location: '',
        latitude: null,
        longitude: null,
        organization_certificate_id: '',
        remarks: '',
        consent: false,
        // Volunteer specific
        availability: '',
        skills: '',
        reason: '',
        emergencyContactPhone: ''
    });

    // File State
    const [files, setFiles] = useState({
        photo: null,
        certificate: null,
        signature: null
    });

    // Map State
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India center
    const [markerPosition, setMarkerPosition] = useState(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setRole('donor');
            setLoading(false);
            setRegisteredId(null);
            setRegisteredId(null);
            
            // Get user email from localStorage
            const userEmail = localStorage.getItem('email') || '';
            
            setFormData({
                name: '',
                age: '',
                address: '',
                organizationName: '',
                panNumber: '',
                aadhaarNumber: '',
                phone: '',
                email: userEmail,
                location: '',
                latitude: null,
                longitude: null,
                organization_certificate_id: '',
                remarks: '',
                consent: false
            });
            setFiles({
                photo: null,
                certificate: null,
                signature: null
            });
            setMarkerPosition(null);
            setMapCenter([20.5937, 78.9629]);
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleChange = handleInputChange; // Alias for consistency

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles(prev => ({
                ...prev,
                [name]: selectedFiles[0]
            }));
        }
    };

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (response.data && response.data.display_name) {
                return response.data.display_name;
            }
            return `${lat}, ${lng}`;
        } catch (error) {
            console.error("Error fetching address:", error);
            return `${lat}, ${lng}`;
        }
    };

    const detectLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const address = await fetchAddress(latitude, longitude);

                    setFormData(prev => ({
                        ...prev,
                        location: address,
                        latitude: latitude,
                        longitude: longitude
                    }));
                    setMapCenter([latitude, longitude]);
                    setMarkerPosition([latitude, longitude]);
                    setLoading(false);
                },
                (err) => {
                    console.error(err);
                    console.error(err);
                    toast.error("Unable to retrieve location.");
                    setLoading(false);
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    // Component to handle map clicks
    const LocationSelector = () => {
        useMapEvents({
            async click(e) {
                const { lat, lng } = e.latlng;
                setMarkerPosition([lat, lng]);
                const address = await fetchAddress(lat, lng);
                setFormData(prev => ({
                    ...prev,
                    location: address,
                    latitude: lat,
                    longitude: lng
                }));
            },
        });
        return markerPosition ? <Marker position={markerPosition} /> : null;
    };

    // Component to recenter map when center changes
    const RecenterMap = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center, map.getZoom());
        }, [center, map]);
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userId = localStorage.getItem('userId');
        // Only require login for donor and recipient
        if (role !== 'volunteer' && !userId) {
            toast.error("User not logged in. Please login first.");
            setLoading(false);
            return;
        }

        // Validate required fields
        if (!formData.name || !formData.phone || !formData.email) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        if (role !== 'volunteer') {
            if (!formData.age || !formData.aadhaarNumber || !formData.panNumber || !formData.location) {
                toast.error("Please fill in all required fields including Age, Aadhaar, PAN, and Location.");
                setLoading(false);
                return;
            }
        } else {
            if (!formData.availability || !formData.skills || !formData.reason || !formData.emergencyContactPhone || !formData.aadhaarNumber || !formData.panNumber || !formData.location) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }
        }

        try {
            let payload = {};
            let endpoint = '';

            if (role === 'volunteer') {
                payload = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    location: formData.location,
                    aadhaarCard: formData.aadhaarNumber,
                    panCard: formData.panNumber,
                    availability: formData.availability,
                    skills: formData.skills,
                    reason: formData.reason,
                    emergencyContactPhone: formData.emergencyContactPhone
                };
                endpoint = 'http://localhost:8080/api/volunteer/add';
            } else {
                payload = {
                    userId: Number(userId),
                    name: formData.name,
                    age: Number(formData.age),
                    address: formData.address,
                    organizationName: formData.organizationName || "",
                    pan: formData.panNumber,
                    aadhaar: formData.aadhaarNumber,
                    phone: formData.phone,
                    email: formData.email,
                    location: formData.location,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    remarks: formData.remarks || "",
                    organization_certificate_id: formData.organization_certificate_id ? Number(formData.organization_certificate_id) : null,
                    consent: formData.consent
                };
                endpoint = role === 'donor' ? 'http://localhost:8080/api/donor/add' : 'http://localhost:8080/api/recipient/add';
            }

            console.log("Submitting payload:", payload);
            console.log("Endpoint:", endpoint);

            const response = await axios.post(endpoint, payload);
            console.log("Response:", response);

            if (role === 'volunteer') {
                // Volunteer backend returns a string message, not the object/ID.
                // We need to fetch the ID to proceed to upload.
                if (response.status === 200) {
                    try {
                        // Search for the volunteer by name to get the ID
                        const searchResponse = await axios.get(`http://localhost:8080/api/volunteer/search?query=${formData.name}`);
                        const volunteers = searchResponse.data;

                        // Find the one with the matching email
                        const createdVolunteer = volunteers.find(v => v.email === formData.email);

                        if (createdVolunteer && createdVolunteer.id) {
                            setRegisteredId(createdVolunteer.id);
                            setStep(2);
                            toast.success("Registration successful! Please upload documents.");
                        } else {
                            throw new Error("Could not retrieve volunteer ID after registration.");
                        }
                    } catch (searchErr) {
                        console.error("Error fetching volunteer ID:", searchErr);
                        toast.error("Registration successful, but failed to retrieve ID for upload. Please contact support.");
                    }
                }
            } else {
                // Donor/Recipient flow (returns ID or object)
                if (response.data) {
                    const newId = response.data.id || response.data.donorId || response.data.recipientId || response.data;

                    if (typeof newId === 'object') {
                        if (newId.id) setRegisteredId(newId.id);
                        else throw new Error("ID not found in response");
                    } else {
                        setRegisteredId(newId);
                    }

                    setStep(2);
                    toast.success("Registration successful! Please upload documents.");
                }
            }
        } catch (err) {
            console.error("Registration error:", err);
            console.error("Error response:", err.response);
            let errorMsg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : "Registration failed. Please try again.");

            // Better error messages for common issues
            if (errorMsg === "User not present") {
                errorMsg = "Unable to verify your account. Please ensure you are logged in and try again.";
            } else if (errorMsg === "Failed to add volunteer") {
                errorMsg = "Registration failed. Email, Phone, Aadhaar, or PAN might already be registered.";
            } else if (errorMsg.includes("Duplicate")) {
                if (errorMsg.includes("email")) {
                    errorMsg = "This email is already registered. Please use a different email.";
                } else if (errorMsg.includes("phone")) {
                    errorMsg = "This phone number is already registered. Please use a different number.";
                } else if (errorMsg.includes("Aadhaar")) {
                    errorMsg = "This Aadhaar number is already registered. Please check your details.";
                } else if (errorMsg.includes("PAN")) {
                    errorMsg = "This PAN number is already registered. Please check your details.";
                }
            }

            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataUpload = new FormData();
            if (files.photo) formDataUpload.append('photo', files.photo);
            if (files.certificate && (role === 'donor' || role === 'recipient')) formDataUpload.append('certificate', files.certificate);
            if (files.signature) formDataUpload.append('signature', files.signature);

            let endpoint = '';
            if (role === 'volunteer') {
                endpoint = `http://localhost:8080/api/volunteer/${registeredId}/photo`;
            } else {
                endpoint = role === 'donor'
                    ? `http://localhost:8080/api/donor/${registeredId}/upload`
                    : `http://localhost:8080/api/recipient/${registeredId}/upload`;
            }

            await axios.post(endpoint, formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update Local Storage and Notify Parent
            localStorage.setItem('is_registered', 'true');
            localStorage.setItem('role', role);
            localStorage.setItem('roleId', registeredId);

            if (role === 'volunteer') {
                localStorage.setItem('logged_in', 'true');
                localStorage.setItem('userId', registeredId);
            }

            if (onRegistrationSuccess) {
                onRegistrationSuccess();
            }

            toast.success("Documents uploaded successfully! Registration complete.");

            setTimeout(() => {
                onClose();
                if (role === 'volunteer') {
                    window.location.href = '/volunteers/dashboard';
                } else {
                    window.location.reload();
                }
            }, 1500);

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response?.data : "Upload failed. Please try again.");
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (step === 2) {
            window.location.reload();
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {step === 1 ? "Registration" : "Upload Documents"}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Role Selection (Only in Step 1) */}
                    {step === 1 && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Register As</label>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('donor')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'donor'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-200 text-gray-600'
                                        }`}
                                >
                                    <User className="w-8 h-8" />
                                    <span className="font-semibold">Donor</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('recipient')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'recipient'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-200 text-gray-600'
                                        }`}
                                >
                                    <Building2 className="w-8 h-8" />
                                    <span className="font-semibold">Recipient</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('volunteer')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'volunteer'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-200 text-gray-600'
                                        }`}
                                >
                                    <Heart className="w-8 h-8" />
                                    <span className="font-semibold">Volunteer</span>
                                </button>
                            </div>
                        </div>
                    )}



                    {/* Step 1: Registration Form */}
                    {step === 1 && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Full address"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        readOnly
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                    <input
                                        type="text"
                                        name="panNumber"
                                        required
                                        value={formData.panNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="ABCDE1234F"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                                    <input
                                        type="text"
                                        name="aadhaarNumber"
                                        required
                                        value={formData.aadhaarNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="1234 5678 9012"
                                    />
                                </div>
                            </div>

                            {role !== 'volunteer' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name {role === 'recipient' && '(Optional)'}</label>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={formData.organizationName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Helping Hands"
                                    />
                                </div>
                            )}

                            {role === 'volunteer' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                            <input
                                                type="text"
                                                name="availability"
                                                required
                                                value={formData.availability}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                placeholder="e.g. Weekends"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                            <input
                                                type="text"
                                                name="skills"
                                                required
                                                value={formData.skills}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                placeholder="e.g. Driving"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                        <input
                                            type="tel"
                                            name="emergencyContactPhone"
                                            required
                                            value={formData.emergencyContactPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Emergency Phone"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer?</label>
                                        <textarea
                                            name="reason"
                                            required
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Share your motivation..."
                                        />
                                    </div>
                                </>
                            )}

                            {role === 'donor' && formData.organizationName && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Certificate ID</label>
                                    <input
                                        type="number"
                                        name="organization_certificate_id"
                                        value={formData.organization_certificate_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="1001"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        name="location"
                                        readOnly
                                        value={formData.location}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none"
                                        placeholder="Auto-detected location"
                                    />
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Detect
                                    </button>
                                </div>

                                {/* Map Container */}
                                <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 z-0">
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationSelector />
                                        <RecenterMap center={mapCenter} />
                                    </MapContainer>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Click on the map to select your location.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Any additional information..."
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    id="consent"
                                    checked={formData.consent}
                                    onChange={handleInputChange}
                                    required
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                />
                                <label htmlFor="consent" className="text-sm text-gray-600">
                                    I agree to the terms and conditions and consent to share my details.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Upload Documents */}
                    {step === 2 && (
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm mb-6">
                                Please upload the required documents to complete your registration.
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="photo-upload"
                                        required
                                    />
                                    <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {files.photo ? files.photo.name : "Click to upload photo"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {(role === 'donor' || (role === 'recipient' && formData.organizationName)) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificate</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                                        <input
                                            type="file"
                                            name="certificate"
                                            accept=".pdf,image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="certificate-upload"
                                            required={role === 'donor'} // Optional for recipient if they didn't strictly require it, but if they have org name it might be good. Let's keep it required if shown? Or maybe just optional.
                                        />
                                        <label htmlFor="certificate-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {files.certificate ? files.certificate.name : "Click to upload certificate"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Signature (Optional)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                                    <input
                                        type="file"
                                        name="signature"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="signature-upload"
                                    />
                                    <label htmlFor="signature-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {files.signature ? files.signature.name : "Click to upload signature"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload & Finish"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
