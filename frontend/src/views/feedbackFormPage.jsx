import React, { useRef, useState } from "react";
import Page from "../components/Page";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { addCustomerFeedback, useCustomerFeedbacks } from "../controllers/feedback.controller";
import { Link } from "react-router-dom";

export default function FeedbackFormPage() {
    const reviewRef = useRef();
    const customerNameRef = useRef();

    const [rating, setRating] = useState(0); // Rating state
    const [service, setService] = useState(0);
    const [food, setfood] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const APIURL = `/feedback`;
    //const { APIURL, data, error, isLoading } = useCustomerFeedbacks();

    //if (isLoading) {
    //    return <Page className="px-8 py-6">Please wait...</Page>
    //}

    //if (error) {
    //    console.error(error);
    //    return <Page className="px-8 py-6">Error loading data, Try Later!</Page>;
    //}

    // Rating component for star selection
    
    const Service  = ({ value, onChange }) => {
        return (<div className="Service">
        {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${value >= star ? 'filled' : ''}`}
                    onClick={() => onChange(star)}
                >
		    ★ 
		</span>
            ))}
        </div>)
    }

    const Food = ({ value, onChange }) => {
        return (                
                <div className="Food">
                {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${value >= star ? 'filled' : ''}`}
                            onClick={() => onChange(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>)
                }

    const Rating = ({ value, onChange }) => {
        return (                                
            <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${value >= star ? 'filled' : ''}`}
                        onClick={() => onChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const btnSave = async () => {
        const review = "";
        const ratingStar = rating;
        const customerName = customerNameRef.current.value;
        const serviceStar = service;
        const foodStar = food;


        try {
            toast.loading("Please wait...");
            const res = await addCustomerFeedback(review, ratingStar, customerName, serviceStar, foodStar);

            if (res.status == 200) {
                await mutate(APIURL);
                toast.dismiss();
                toast.success(res.data.message);
            }
            setRating(0);
            // setReview('');
            setCustomerName('');
            setfood(0);
            setService(0);

            // reviewRef.current.value = '';
            customerNameRef.current.value = '';

        } catch (error) {
            const message = error?.response?.data?.message || "Something went wrong!";
            console.error(error);
            toast.dismiss();
            toast.error(message);
        }
    };

    return (
        <Page className="px-8 py-6">
            <h3 className="text-3xl font-light">Customer Feedback Form</h3>

            <div className="mt-8 text-sm text-gray-500">
                <div className="form-group">
                    <label htmlFor="name" className="block mb-1">
                        Customer Name
                    </label>
                    <input
                        ref={customerNameRef}
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={customerName}
                        placeholder="Enter Customer Name here..."
                        className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-salespos-border-green-light"
                    />                    
                </div>
                <div className="form-group">
                    <label>Service </label>
                    <Service value={service} onChange={setService} />
                </div>
                <div className="form-group">
                    <label>Food Taste </label>
                    <Food value={food} onChange={setfood} />
                </div>
                <div className="form-group">
                    <label>Overall Rating </label>
                    <Rating value={rating} onChange={setRating} /> {/* Set rating on star click */}
                </div>
                
                <button onClick={btnSave} className="text-white w-full lg:min-w-96 bg-salespos-green transition hover:bg-salespos-green/80 active:scale-95 rounded-lg px-4 py-2 mt-6 outline-salespos-border-green-light">
                    Save
                </button>
            </div>
        </Page>
    );
}
