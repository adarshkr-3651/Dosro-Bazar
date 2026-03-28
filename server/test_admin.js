import fetch, { FormData, File } from 'node-fetch';

async function testAdminAdDeploy() {
    console.log("Testing Admin Ad Deploy...");
    try {
        // 1. Login to get token
        const res = await fetch('http://localhost:5000/admin-auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin@dosrobazar.com',
                password: 'adarsh@3651A'
            })
        });

        const data = await res.json();

        let adminToken = '';
        const cookies = res.headers.raw()['set-cookie'];
        if (cookies) {
            const cookieString = cookies.find(c => c.startsWith('admin_access_token='));
            if (cookieString) {
                adminToken = cookieString.split(';')[0];
            }
        }

        console.log("Got token from login:", adminToken.substring(0, 30) + '...');

        // 2. Deploy Ad
        console.log("\nTesting Ad Deployment...");
        const formData = new FormData();
        formData.append('companyName', 'Test Company');
        formData.append('plan', 'Premium');
        formData.append('expiryDate', '2026-12-31');
        formData.append('placement', 'main_banner');

        // Add a dummy text file as image (the multer might fail it but it gets past auth)
        formData.append('image', new File(['dummy content'], 'dummy.jpg', { type: 'image/jpeg' }));

        const deployRes = await fetch('http://localhost:5000/advertisements/create', {
            method: 'POST',
            headers: {
                'Cookie': adminToken
            },
            body: formData
        });

        const deployData = await deployRes.text();
        console.log("Deploy Status:", deployRes.status);

        try {
            console.log("Deploy Response:", JSON.stringify(JSON.parse(deployData), null, 2));
        } catch (e) {
            console.log("Deploy Response:", deployData);
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testAdminAdDeploy();
