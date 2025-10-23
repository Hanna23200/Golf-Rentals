import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://mahiawlcywajnqthyscw.supabase.co'
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1haGlhd2xjeXdham5xdGh5c2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjIyMTAsImV4cCI6MjA3NjAzODIxMH0._UzYBsr2GZRxqaJLit7vQuEuwR9-M3XYtDYjCygkuio'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const submitBtn = document.getElementById('submit_booking');
const totalPriceInput = document.getElementById('total_price_num');
const hourForm = document.getElementById('hour_form');

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // ป้องกัน reload หน้า

  const totalPrice = parseFloat(totalPriceInput.value);
  if (!totalPrice || totalPrice <= 0) {
    alert('กรุณาเลือกสินค้าและคำนวณราคารวมก่อนยืนยันการเช่า');
    return;
  }

  // -----------------------------
  // ดึงข้อมูลฟอร์ม
  // -----------------------------
  const formData = new FormData(hourForm);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    items: formData.getAll('item[]'), // array
    start_date: formData.get('start_date'),
    start_time: formData.get('start_time'),
    hours: parseInt(formData.get('hours')) || 0,
    total_price: totalPrice,
    message: formData.get('message') || '',
    created_at: new Date().toISOString() // Supabase ใช้ ISO string
  }

  console.log('Data to insert:', data); // เช็คก่อน insert

  const { data: insertedData, error } = await supabase
    .from('rentals_hour')
    .insert([data])
    .select(); // .select() เพื่อให้ได้ข้อมูลกลับมา

  if (error) {
    console.error('Supabase error:', error);
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + error.message);
    return;
  }

  console.log('Inserted data:', insertedData);
  alert('ยืนยันเช่าสำเร็จ!');
  hourForm.reset();
  totalPriceInput.value = '';
});
