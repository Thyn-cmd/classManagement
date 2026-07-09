import React from 'react';
import { Users, Shield, GraduationCap } from 'lucide-react';

const DashboardStats = ({ members }) => {
    const total = members.length;
    const leaders = members.filter(m => m.role === 'หัวหน้าห้อง' || m.role === 'รองหัวหน้าห้อง').length;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-indigo-500 transform transition-transform hover:-translate-y-1">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">จำนวนนักเรียนทั้งหมด</p>
                    <h3 className="text-3xl font-bold text-gray-800">{total} <span className="text-lg font-normal text-gray-500">คน</span></h3>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-500">
                    <Users size={32} />
                </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-emerald-500 transform transition-transform hover:-translate-y-1">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">หัวหน้า/รองหัวหน้า</p>
                    <h3 className="text-3xl font-bold text-gray-800">{leaders} <span className="text-lg font-normal text-gray-500">คน</span></h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-500">
                    <Shield size={32} />
                </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-l-4 border-amber-500 transform transition-transform hover:-translate-y-1">
                <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">เจ้าหน้าที่อื่นๆ</p>
                    <h3 className="text-3xl font-bold text-gray-800">{total - leaders} <span className="text-lg font-normal text-gray-500">คน</span></h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-full text-amber-500">
                    <GraduationCap size={32} />
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
