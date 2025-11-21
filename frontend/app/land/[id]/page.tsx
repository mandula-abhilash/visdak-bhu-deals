'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { landAPI, paymentAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Lock, MapPin } from 'lucide-react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function LandDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [land, setLand] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLandDetails();
  }, [params.id]);

  const loadLandDetails = async () => {
    try {
      const result = await landAPI.getById(params.id as string);
      setLand(result.land);

      if (isAuthenticated) {
        const accessResult = await paymentAPI.checkLandAccess(params.id as string);
        if (accessResult.hasAccess) {
          setHasAccess(true);
          loadFullDetails();
        }
      }
    } catch (error) {
      console.error('Error loading land:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFullDetails = async () => {
    try {
      const result = await landAPI.getFullDetails(params.id as string);
      setLand(result.land);
    } catch (error) {
      console.error('Error loading full details:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const result = await paymentAPI.createSubscriptionOrder('monthly');
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.amount,
        currency: result.currency,
        name: 'Land Listings',
        description: 'Monthly Subscription',
        order_id: result.order_id,
        handler: async (response: any) => {
          await paymentAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan_type: 'monthly',
          });
          alert('Subscription activated!');
          window.location.reload();
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert('Failed to create order');
    }
  };

  const handlePurchase = async () => {
    try {
      const result = await paymentAPI.createSitePurchaseOrder(params.id as string);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.amount,
        currency: result.currency,
        name: 'Land Listings',
        description: 'Site Access Purchase',
        order_id: result.order_id,
        handler: async (response: any) => {
          await paymentAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            land_id: params.id,
          });
          alert('Access granted!');
          window.location.reload();
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert('Failed to create order');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!land) {
    return <div className="container mx-auto px-4 py-8">Land not found</div>;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-primary mb-4">{land.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center text-gray-600"><MapPin className="w-4 h-4 mr-1" /> {land.district}</span>
              <span className="bg-primary text-white px-4 py-1 rounded-full">{land.price_range}</span>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Area Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="text-xl font-bold text-primary">{Number(land.area_sqft).toLocaleString()}</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Square Yards</p>
                  <p className="text-xl font-bold text-primary">{Number(land.area_sqyards).toLocaleString()}</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Guntas</p>
                  <p className="text-xl font-bold text-primary">{Number(land.area_guntas).toLocaleString()}</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Acres</p>
                  <p className="text-xl font-bold text-primary">{Number(land.area_acres).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700">{land.description || 'No description available'}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <p className="text-gray-700 mb-4">{land.location_text}</p>

              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Static Map Placeholder</p>
              </div>

              {!hasAccess && isAuthenticated && (
                <div className="mt-6 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Unlock Full Location Details</h3>
                  <p className="mb-6">Get access to interactive map, exact address, and owner information</p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={handleSubscribe} className="btn-primary bg-white text-primary hover:bg-gray-100">Subscribe (₹999/month)</button>
                    <button onClick={handlePurchase} className="btn-secondary border-white text-white hover:bg-white hover:text-primary">Purchase This Land (₹99)</button>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-6 bg-gray-100 p-6 rounded-lg text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2">Login to Unlock Full Details</h3>
                  <a href="/login" className="btn-primary mt-4 inline-block">Login / Register</a>
                </div>
              )}

              {hasAccess && (
                <div className="mt-6 bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-green-800 mb-4">Private Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Exact Address:</strong> {land.exact_address || 'N/A'}</p>
                    <p><strong>Owner Name:</strong> {land.owner_name || 'N/A'}</p>
                    <p><strong>Survey Number:</strong> {land.survey_number || 'N/A'}</p>
                    <p><strong>Exact Price:</strong> ₹{land.exact_price ? Number(land.exact_price).toLocaleString() : 'N/A'}</p>
                    <p><strong>Contact:</strong> {land.contact_info || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-primary mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">District</span>
                  <span className="font-semibold">{land.district}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Area</span>
                  <span className="font-semibold">{land.area_guntas} guntas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-semibold">{land.price_range}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
