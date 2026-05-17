import React from 'react'
import SectionTitle from '../../common/SectionTitle'
import posData from './posData'
import SingleInventory from './SingleInventory'
export default function Inventory() {
    return (
        <section
            id="blog"
            className="bg-gray-900 py-16 md:py-20 lg:py-28"
        >
            <div className="container">
                <SectionTitle
                    title="Comprehensive POS Solutions"
                    paragraph="Intutive reporting system for real-time insights on sales, inventory, and performance"
                    center
                />
                <div className="mx-auto w-full items-center"
                    style={{ maxWidth: 1200 }}>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
                        {posData.map((pos) => (
                            <div key={pos.id} className="w-full">
                                <SingleInventory pos={pos} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
