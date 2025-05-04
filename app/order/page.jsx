"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { client } from '../../utils/sanityClient';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "order"] | order(orderDate desc)`
        );
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <p className="font-medium">Order Number</p>
                <p className="text-green-600 sm:text-lg break-all">
                  {order.orderNumber || order._id}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Order Date</p>
                <p>{order.orderDate ? formatDate(order.orderDate) : 'N/A'}</p>
                <p className="font-medium mt-2">Total Amount</p>
                <p>
                  ₹
                  {order.products?.reduce(
                    (total, item) => total + (item.totalPrice || 0),
                    0
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium">Status:</p>
              <span className="inline-block mt-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                {order.status || 'pending'}
              </span>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <p className="text-sm font-medium mb-2">Order Items</p>
              {order.products?.map((item) => (
                <div key={item._key || item.title} className="flex items-center gap-4 mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="rounded border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                  <div className="font-medium">₹{item.totalPrice?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
