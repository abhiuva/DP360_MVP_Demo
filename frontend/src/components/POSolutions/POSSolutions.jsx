import React from 'react'
import SectionTitleBlack from '../../common/SectionTitleWhite'
import SectionTitle from '../../common/SectionTitle'

export default function POSSolutions() {
    return (
        <section className="py-16 md:py-20 lg:py-28 bg-gray-200">
            <div className="container mx-auto px-4">
                <SectionTitleBlack
                    title="Comprehensive POS Solutions"
                    paragraph="Streamline your restuarant operations with our advanced POS Reporting system for better insights"
                    center
                />
                <div className="flex flex-col lg:flex-row items-center justify-center">
                    {/* Left Section */}


                    {/* Left Section */}
                    <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                        <div className="relative mx-auto max-w-[500px] aspect-[25/24]">
                            <img
                                src="/images/about/about.jpg"
                                alt="about image"
                                className="object-cover drop-shadow-3xl dark:hidden"
                            />
                        </div>
                    </div>
                    {/* Right Section */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <div className="mb-9 px-4 lg:px-20">
                            <h3 className="text-xl font-semibold mb-4">
                                Detailed Reporting Features
                            </h3>
                            <p className="font-medium">
                                Access comprehensive reports to analyze performance and enahce yours resuratant's profitability.
                            </p>
                        </div>
                        <div className="mb-9 px-4 lg:px-20">
                            <h3 className="text-xl font-semibold mb-4">
                                Sales Performance Overview
                            </h3>
                            <p className="font-medium">
                                Get real-time insights into your sales performance and trends for informed decision-making.
                            </p>
                        </div>
                        <div className="mb-9 px-4 lg:px-20">
                            <h3 className="text-xl font-semibold mb-4">
                                Inventory Management Tools
                            </h3>
                            <p className="font-medium">
                                Efficiently track and manage your inventory to reduce waste and optimize stock levels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
