import React from 'react'

const DonorFoodList = () => {
    return (
        <div className="w-full overflow-hidden">
            {/* --- Hero Section --- */}
            <div className="relative w-full py-16 px-4 border-b-2 border-green-500/10">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <Send className="w-16 h-16 mx-auto text-green-600 mb-4 animate-bounce-slow" />
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight animate-slide-down">
                        Your Donation <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300">Request Hub</span>
                    </h1>
                    <p className="text-xl opacity-80 max-w-4xl mx-auto animate-slide-down" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        View which recipient organizations have requested your listed food items.
                    </p>
                </div>
            </div>

            {/* --- Listings and Requests Grid --- */}
            <div className="py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {listings.length === 0 && (
                        <div className="p-10 rounded-xl text-center border-2 border-gray-300/50">
                            <Utensils className="w-10 h-10 mx-auto opacity-50 mb-3" />
                            <p className="font-semibold opacity-70">You currently have no active donation listings.</p>
                        </div>
                    )}

                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300"
                            style={{
                                maxHeight: expandedListing === listing.id ? '1000px' : '150px'
                            }}
                        >
                            {/* Listing Header (Always Visible) */}
                            <div
                                className={`p-6 flex items-center justify-between cursor-pointer transition-colors duration-200 ${expandedListing === listing.id ? 'bg-green-500/10' : 'hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
                                    }`}
                                onClick={() => toggleExpansion(listing.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <Package className="w-8 h-8 text-green-600" />
                                    <div>
                                        <p className="text-lg font-bold">{listing.foodType}</p>
                                        <p className="text-sm opacity-70 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {listing.readyTime} ({listing.quantity})
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(listing.status)}`}>
                                        {listing.status}
                                    </span>
                                    {listing.requests.length > 0 && (
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-emerald-500 text-white animate-pulse-slow`}>
                                            {listing.requests.length} Request(s)
                                        </span>
                                    )}
                                    <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${expandedListing === listing.id ? 'rotate-180' : 'rotate-0'}`} />
                                </div>
                            </div>

                            {/* Requests Body (Expandable) */}
                            <div className={`p-6 pt-0 ${expandedListing === listing.id ? 'block' : 'hidden'}`}>
                                <h3 className="text-xl font-bold mb-4 pt-4 border-t border-gray-200">Pending Requests</h3>

                                {listing.requests.length === 0 && (
                                    <p className="text-sm opacity-60">No recipient has requested this item yet. Check back soon!</p>
                                )}

                                <div className="space-y-4">
                                    {listing.requests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="p-4 rounded-xl border-2 border-green-500/30 flex justify-between items-center transition-all duration-300 hover:shadow-md"
                                        >
                                            {/* Request Details */}
                                            <div className="space-y-1">
                                                <p className="font-bold text-lg text-emerald-700">{request.recipient}</p>
                                                <p className="text-sm opacity-80 flex items-center gap-1">
                                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                                    Urgency: <span className={getUrgencyClass(request.urgency)}>{request.urgency}</span>
                                                </p>
                                                <p className="text-xs opacity-60">{request.timeRequested}</p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleApprove(listing.id, request.id)}
                                                    className="p-2 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition duration-150"
                                                    title="Approve Match"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(listing.id, request.id)}
                                                    className="p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition duration-150"
                                                    title="Reject Request"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Reusing the Home page styles for animations --- */}
            <style>{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pop-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                .animate-slide-down { animation: slide-down 0.8s ease-out forwards; }
                .animate-pop-in { animation: pop-in 0.6s ease-out forwards; }
                .animate-gradient { background-size: 300% 300%; animation: gradient 4s ease infinite; }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
                .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
                .bg-300 { background-size: 300%; }
            `}</style>
        </div>
    );
};

export default DonorFoodList