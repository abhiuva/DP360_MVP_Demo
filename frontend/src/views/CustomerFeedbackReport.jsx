import React, { useEffect, useState } from 'react';
import { useCustomerFeedbacks } from '../controllers/feedback.controller';
import Page from "../components/Page";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import toast from 'react-hot-toast';

export const CustomerFeedbackReport = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const { data, error, isLoading } = useCustomerFeedbacks();

    useEffect(() => {
        if (data) {
            setFeedbackData(data);
            setFilteredData(data);
        }
    }, [data]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = feedbackData.filter((data) =>
            Object.values(data).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(query)
            )
        );
        setFilteredData(filtered);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setFilteredData(feedbackData);
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById("pdf-content");

        if (!input) {
            console.error("Error: PDF content element not found!");
            return;
        }

        setTimeout(() => {
            html2canvas(input, { scale: 2 })
                .then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF("p", "mm", "a4");
                    const imgWidth = 210;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
                    pdf.save(`Customer_Feedback_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
                    toast.success("📄 PDF Downloaded Successfully!");
                })
                .catch((error) => console.error("PDF Generation Error:", error));
        }, 300); // Slight delay to ensure rendering
    };

    const handleSort = (field) => {
        const sorted = [...filteredData].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (!isNaN(aValue) && !isNaN(bValue)) {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else {
                aValue = aValue?.toString().toLowerCase();
                bValue = bValue?.toString().toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredData(sorted);
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (isLoading) {
        return <Page>Loading customer feedback data...</Page>;
    }

    if (error) {
        return <Page>Error loading customer feedback data. Please try again later.</Page>;
    }

    return (
        <Page>
            <h3 className="text-2xl">Customer Feedback Report</h3>

            <div className="flex justify-between items-center mb-4">
                {/* Search Input with Clear Button */}
                <div className="relative w-60 mt-2 ">
                    <input
                        onChange={handleSearch}
                        value={searchQuery}
                        type="text"
                        placeholder="Search Customer"
                        className="bg-gray-100 placeholder:text-gray-400 outline-none block w-full h-9 px-4 pr-10 py-2 rounded-lg"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* PDF Download Button */}
                <div className=''>
                    <div onClick={handleDownloadPDF} className='download-2' style={{ textAlign: 'center', paddingTop: "3px", fontSize: "22px", color: "white" }}>
                        <i className="fa-solid fa-file-pdf"></i>
                    </div>
                </div>
            </div>

            <div id="pdf-content" style={{ width: "100%" }}>
                <table className='table table-sm table-zebra border w-full text-lg'>
                    <thead>
                        <tr>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('id')}>
                                ID {sortField === 'id' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('customer_name')}>
                                Customer Name {sortField === 'customer_name' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('service')}>
                                Service {sortField === 'service' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('food')}>
                                Food {sortField === 'food' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('rating')}>
                                Overall Rating {sortField === 'rating' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th>
                            {/* <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('review')}>
                                Review {sortField === 'review' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th> */}
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('created_at')}>
                                Date {sortField === 'created_at' && (sortOrder === "asc" ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((feedback) => (
                                <tr key={feedback.id}>
                                    <td className='text-center'>{feedback.id}</td>
                                    <td className='text-center'>{feedback.customer_name}</td>
                                    <td className='text-center'>{feedback.service}</td>
                                    <td className='text-center'>{feedback.food}</td>
                                    <td className='text-center'>{feedback.rating}</td>
                                    {feedback.review && <td className='text-center'>{feedback.review}</td>}
                                    <td className='text-center'>{new Date(feedback.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No feedback data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Page>
    );
};

export default CustomerFeedbackReport; 