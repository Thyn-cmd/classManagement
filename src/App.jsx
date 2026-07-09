import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Search, Edit2, Trash2, MapPin, X } from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import MemberForm from './components/MemberForm';
import { supabase } from './supabaseClient';

function App() {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // Fetch members on component mount
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching members:', error);
            // Ignore error gracefully (might be missing configuration)
        } else {
            setMembers(data || []);
        }
        setIsLoading(false);
    };

    const filteredMembers = useMemo(() => {
        return members.filter(m => 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            m.id.includes(searchTerm) ||
            m.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [members, searchTerm]);

    const handleAddMember = async (member) => {
        if (members.some(m => m.id === member.id)) {
            alert('รหัสนักเรียนนี้มีอยู่ในระบบแล้ว');
            return;
        }

        const { data, error } = await supabase
            .from('members')
            .insert([member])
            .select();

        if (error) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
        } else {
            setMembers([...members, data[0]]);
            setIsFormOpen(false);
        }
    };

    const handleEditMember = async (member) => {
        const { data, error } = await supabase
            .from('members')
            .update({
                name: member.name,
                nickname: member.nickname,
                role: member.role,
                address: member.address
            })
            .eq('id', member.id)
            .select();

        if (error) {
            alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล: ' + error.message);
        } else {
            setMembers(members.map(m => m.id === member.id ? data[0] : m));
            setIsFormOpen(false);
            setEditingMember(null);
        }
    };

    const handleDelete = async (id, name) => {
        if (confirm(`คุณต้องการลบข้อมูลของ "${name}" ใช่หรือไม่?`)) {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
            } else {
                setMembers(members.filter(m => m.id !== id));
            }
        }
    };

    const openEditForm = (member) => {
        setEditingMember(member);
        setIsFormOpen(true);
    };

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'หัวหน้าห้อง': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'รองหัวหน้าห้อง': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'เหรัญญิก': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'เลขานุการ': return 'bg-pink-100 text-pink-700 border-pink-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <div className="bg-indigo-600 text-white py-8 px-6 shadow-md mb-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">ระบบจัดการสมาชิกในชั้นเรียน</h1>
                        <p className="text-indigo-200">จัดการรายชื่อ บทบาท และที่อยู่ของนักเรียน (เชื่อมต่อ Supabase)</p>
                    </div>
                    <button 
                        onClick={() => { setEditingMember(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <UserPlus size={20} />
                        เพิ่มนักเรียนใหม่
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                <DashboardStats members={members} />

                {/* Search Bar */}
                <div className="glass-panel p-4 rounded-2xl mb-6 flex items-center gap-3">
                    <div className="text-gray-400 pl-2">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="ค้นหาจากรหัสนักเรียน, ชื่อ หรือชื่อเล่น..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-2"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 p-2">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Member List */}
                <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200">
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-sm">รหัส</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-sm">ชื่อ-นามสกุล</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-sm">ชื่อเล่น</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-sm">หน้าที่</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-sm w-1/3">ที่อยู่</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-lg">กำลังโหลดข้อมูล...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-indigo-50/30 transition-colors group">
                                            <td className="py-4 px-6 text-gray-700 font-medium">{member.id}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-inner">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">{member.nickname || '-'}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(member.role)}`}>
                                                    {member.role || 'นักเรียนทั่วไป'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-start gap-2 text-gray-600 text-sm">
                                                    <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                                                    <span className="line-clamp-2" title={member.address}>{member.address || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEditForm(member)}
                                                        className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                        title="แก้ไข">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(member.id, member.name)}
                                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="ลบ">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-gray-100 rounded-full">
                                                    <Search size={32} className="text-gray-400" />
                                                </div>
                                                <p className="text-lg">ไม่พบข้อมูลนักเรียนที่ค้นหา</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isFormOpen && (
                <MemberForm 
                    editingMember={editingMember}
                    onSubmit={editingMember ? handleEditMember : handleAddMember}
                    onCancel={() => { setIsFormOpen(false); setEditingMember(null); }}
                />
            )}
        </div>
    );
}

export default App;
