import React, { useState } from 'react';
import { UserPlus, Edit2, X } from 'lucide-react';

const ROLES = [
    'นักเรียนทั่วไป',
    'หัวหน้าห้อง',
    'รองหัวหน้าห้อง',
    'เหรัญญิก',
    'เลขานุการ'
];

const MemberForm = ({ onSubmit, onCancel, editingMember }) => {
    const [formData, setFormData] = useState(
        editingMember || { id: '', name: '', nickname: '', role: 'นักเรียนทั่วไป', address: '' }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {editingMember ? <Edit2 size={24} /> : <UserPlus size={24} />}
                        {editingMember ? 'แก้ไขข้อมูลนักเรียน' : 'เพิ่มนักเรียนใหม่'}
                    </h2>
                    <button onClick={onCancel} className="text-indigo-200 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสนักเรียน</label>
                            <input required type="text" name="id" value={formData.id} onChange={handleChange} disabled={!!editingMember}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500" 
                                placeholder="เช่น 65001" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเล่น</label>
                            <input required type="text" name="nickname" value={formData.nickname} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                                placeholder="เช่น ชาย" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                            placeholder="นาย/นางสาว..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">หน้าที่ในห้อง</label>
                        <select name="role" value={formData.role} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white">
                            {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                        <textarea required name="address" value={formData.address} onChange={handleChange} rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" 
                            placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
                    </div>
                    
                    <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100">
                        <button type="button" onClick={onCancel}
                            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                            ยกเลิก
                        </button>
                        <button type="submit"
                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-200">
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MemberForm;
