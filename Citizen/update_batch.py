import os
import re

files_to_update = [
    'dashboard.html', 'profile.html', 'edit_profile.html', 'services.html', 
    'my_requests.html', 'booking.html', 'notifications.html', 'complaints.html', 
    'request_details.html', 'service_request.html', 'national_id.html', 
    'birth_certificate.html', 'death_certificate.html', 'spinsterhood_cert.html', 
    'passport_ordinary.html', 'passport_marine.html', 'passport_business.html', 
    'payment.html'
]

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace Nationality
    content = content.replace('سعودي', 'يمني')
    content = content.replace('سعودية', 'يمنية')

    # 2. Add value="يمني" to Nationality inputs if they don't have it
    # Find <label>...الجنسية</label> followed by <input...>
    content = re.sub(r'(<label[^>]*>الجنسية</label>\s*<input[^>]*)(>)', r'\1 value="يمني"\2', content)

    # 3. Link script.js and remove inline toggle
    if 'script.js' not in content:
        content = content.replace('</body>', '<script src="script.js"></script>\n</body>')
    
    # Remove toggleSidebar function locally
    content = re.sub(r'function toggleSidebar\(\) \{.*?\}', '', content, flags=re.DOTALL)

    # 4. Activate File upload buttons
    # Example: <button type="button">تصفح الملفات</button>
    # Change to a real file input or make it trigger one.
    # Actually, many have <input type="file"> already. 
    # Let's just make sure they all have the class form-control-custom
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in files_to_update:
    path = os.path.join(r'd:\Final_Project\Citizen', filename)
    if os.path.exists(path):
        update_file(path)
