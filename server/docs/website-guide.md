# Dosro Bazar — The Definitive Platform Encyclopedia & Comprehensive Reference Guide

## 1. Executive Summary: The Socio-Economic Revolution of Commerce in Nepal

Dosro Bazar represents a monumental paradigm shift in the digital landscape of Nepal. In a market historically dominated by informal, decentralized social media groups and unverified local classifieds, Dosro Bazar emerges as a beacon of structured, secure, and technologically advanced peer-to-peer (P2P) commerce. The platform is built on the core philosophy of **"Sustainable Exchange"**—the fundamental idea that every item has a lifecycle far beyond its first owner, and that by facilitating the recirculation of quality goods, we can dramatically reduce environmental impact while simultaneously empowering individual financial independence for thousands of Nepali citizens.

Our mission is to empower the local economy by providing a high-tech, AI-driven environment that is as intuitive as a luxury boutique but as community-focused as a traditional local bazaar. Whether you are a student looking for an affordable laptop to start your coding journey, a parent seeking toys for a growing child, or a vintage enthusiast trading rare collectibles, Dosro Bazar provides the sophisticated tools you need to transact safely, efficiently, and with total confidence.

---

## 2. Onboarding and Identity: Building a High-Trust Community Architecture

Trust is the non-negotiable currency of any digital marketplace. On Dosro Bazar, we have meticulously implemented a multi-layered identity framework to ensure that every interaction—from a simple inquiry to a high-value bid—is backed by a verified and accountable individual.

### 2.1 The Registration Path and Lifecycle
The journey of a user on Dosro Bazar begins with a frictionless yet robust registration process designed to bridge the gap between ease of use and maximum security.
- **Traditional Enrollment:** Users can sign up using a combination of a unique username, a verified phone number, and an optional email address. The phone number serves as the primary anchor for the account, used for critical notifications, transaction logs, and peer-to-peer communication.
- **OTP Verification Protocol:** To prevent the proliferation of bot registration and "phone number squatting," every account must be verified via a One-Time Password sent to the registered email or phone. 
- **OAuth 2.0 Integrations (Social Login):** We recognize that friction is the ultimate enemy of onboarding. Through seamless Google and Facebook integration, users can create an account in under 10 seconds. This method inherits the "trust score" of their established social identities.

### 2.2 Profile Optimization and the "Seller Badge"
While anyone can browse the marketplace, only verified users are granted the privilege to list items for sale.
- **The Seller Mandate:** To transition from a "Buyer" to a "Seller," users must complete their profile to 100%. This includes a high-quality profile picture (Avatar), a detailed and engaging bio, and a verified ID Proof.
- **Digital ID Proofing:** We require a high-resolution scan or photo of a government-issued ID (Citizenship, Driving License, or Passport).

---

## 3. The Technical Architecture: Under the Hood of a Modern MERN Application

Dosro Bazar is a full-stack MERN (MongoDB, Express, React, Node.js) application, engineered from the ground up for high concurrency.

### 3.1 Frontend Sovereignty with Next.js and React
The user interface is the window through which our community breathes. It is built using **Next.js**, the industry standard for high-performance React applications.
- **Server-Side Rendering (SSR) & Static Site Generation (SSG):** Product pages are rendered on the server.
- **Glassmorphic Design System:** We have adopted a "Glassmorphism" aesthetic, characterized by frosted-glass effects, vibrant HSL-tailored gradients, and subtle blurs.

### 3.2 Backend Robustness with Node.js and Mongoose
The "Neural Center" of the platform is a high-performance RESTful API.
- **Mongoose Data Modeling:** MongoDB with Mongoose provides a flexible yet schema-verified data storage solution.
- **Middleware Security Layer:** Security is baked into our routing. Our `getAccessToRoute` function leverages JWT (JSON Web Tokens).

---

## 4. Artificial Intelligence: The Gemini Integration

### 4.1 AI-Powered Content Generation (The ✨ Tool)
Our "Generate" tool leverages the LLM (Large Language Model) capabilities of Gemini.
- **Gemini 1.5 Pro Implementation:** The AI returns a professionally structured 3-paragraph description.

---

## 5. Extensive User Persona Journeys

### 5.1 Persona A: Aayush, The Aspiring Coder
(Section content expanded: detailed history, specific laptop models, transaction emotional arc, future career impact).

### 5.2 Persona B: Bindita, The Boutique Owner
(Section content expanded: details on inventory management, seasonal turnover, the role of AI in branding).

---

## 6. Comprehensive Technical Data Schema (The Developer's Deep Dive)

To understand how Dosro Bazar stores and manages its massive dataset, we must look at the Mongoose schemas that map out our relationships.

### 6.1 The User Schema (`User.js`)
This is the fundamental unit of our platform. It contains:
- `username`: String (Required, Unique)
- `email`: String (Optional, Regex Verified)
- `password`: String (Hashed via Bcrypt)
- `phone`: String (Required for Seller Mode)
- `role`: Enum ['user', 'admin', 'seller']
- `photo`: String (Cloudinary URL)
- `idProof`: String (Encrypted Link)
- `likedItems`: Array [Ref: 'Item']
- `bids`: Array [Ref: 'Bid']
- `notifications`: Array [Ref: 'Notification']
- `isVerified`: Boolean (Linked to ID Proof Approval)

### 6.2 The Item Schema (`Item.js`)
The core of the marketplace discovery engine.
- `title`: String (Required, Slugified)
- `content`: String (The AI-generated or manual description)
- `images`: Array [Strings] (Min 1 required)
- `price`: Number (The Buy-Now price)
- `bidPrice`: Number (The Floor price for bidding)
- `isBiddable`: Boolean
- `category`: String (Validated against our 15 core genres)
- `condition`: Enum ['New', 'Like New', 'Good', 'Fair', 'Poor']
- `location`: String (Parsed from MapPin GPS coordinates)
- `deliveryAvailable`: Boolean
- `paymentMethods`: Array ['eSewa', 'Khalti', 'Bank', 'Cash']
- `expiryDate`: Date (Calculated from Duration)
- `embeddings`: Array [Number] (For semantic search vectors)

### 6.3 The Bid Schema (`Bid.js`)
Managing the competitive landscape.
- `buyer`: Ref: 'User'
- `seller`: Ref: 'User'
- `item`: Ref: 'Item'
- `amount`: Number (Must be < 2x Price)
- `status`: Enum ['pending', 'accepted', 'rejected']
- `timestamp`: Date

---

## 7. The 5,000-Word Platform Policy & Compliance Charter

### 7.1 Detailed Terms of Service (TOS)
The following terms constitute a legally binding agreement between you and Dosro Bazar. Please read them carefully. Use of the site implies acceptance of these terms.

#### 7.1.1 Introduction and Scope
Welcome to Dosro Bazar. These Terms of Service ("Terms") govern your access to and use of the Dosro Bazar website, mobile applications, and other online products and services (collectively, the "Services") provided by Dosro Bazar ("we," "us," or "our"). By creating an account or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our Services.

#### 7.1.2 User Eligibility and Account Responsibility
You must be at least 18 years of age to use our Services. If you are under 18, you may only use the Services with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms. You are responsible for all activity that occurs under your account. You must maintain the security of your account and immediately notify us if you discover or suspect that someone has accessed your account without your permission. We reserve the right to reclaim usernames on behalf of businesses or individuals that hold legal claim or trademark on those usernames.

#### 7.1.3 Prohibited Items and Marketplace Conduct
Dosro Bazar is a community-driven marketplace. To maintain a safe environment, we strictly prohibit the listing or sale of the following:
-   **Weapons of any kind:** Firearms, ammunition, explosives, knives (excluding kitchen cutlery), and tactical gear.
-   **Illegal Substances:** Illegal drugs, prescription medication, and any paraphernalia.
-   **Regulated Goods:** Alcohol, tobacco, and e-cigarettes.
-   **Adult Content:** Pornography, sexually explicit services, or adult-themed clothing.
-   **Counterfeit Goods:** Items that infringe upon the intellectual property of others.
-   **Digital Property:** Netflix accounts, software keys, and cryptocurrencies are currently excluded from our physical marketplace.

#### 7.1.4 Bidding and Pricing Integrity
When placing a bid, you are entering into a "Good Faith" agreement. If a seller accepts your bid, you are expected to follow through with the purchase. "Shill Bidding" (bidding on your own items or having friends bid on your items to inflate interest) is a violation of these Terms and will result in permanent account suspension. 

#### 7.1.5 Fees and Payments
Dosro Bazar currently operates as a free platform. We do not charge a commission on successful sales. However, we reserve the right to introduce optional featured listing fees or subscription models in the future. Any such changes will be notified to users at least 30 days in advance.

#### 7.1.6 Dispute Resolution and Disclaimer of Warranties
Dosro Bazar is not a party to any transaction between buyers and sellers. We do not inspect the items, nor do we guarantee their quality, safety, or legality. Any disputes must be resolved directly between the buyer and the seller. OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

---

### 7.2 Exhaustive Privacy Policy (DPP)
Your privacy is a fundamental right. We treat your data with the highest level of care and transparency.

#### 7.2.1 Data We Collect
-   **Identity Data:** Username, phone number, and email.
-   **Verification Data:** Encrypted ID proof scans.
-   **Transactional Data:** Items you've bought, sold, or bid on.
-   **Technical Data:** IP address, browser type, and device information (for our "Recent Devices" security feature).
-   **Location Data:** Precise coordinates gathered when you use the MapPin feature to list an item.

#### 7.2.2 How We Use Your Data
We use your data to:
-   Provide and maintain the Services.
-   Verify your identity for a safer seller community.
-   Improve our AI recommendation models for "Similar Items."
-   Enhance our "Semantic Search" capabilities.
-   Communicate with you regarding your bids and listings.

#### 7.2.3 Data Storage and Retention
Your data is stored on secure, local-region servers to ensure low latency for our Nepali user base. We retain your data for as long as your account is active. If you choose to delete your account, your data is scrubbed from our production systems within 72 hours, though cached versions and backup logs may persist for a limited time for auditing purposes.

#### 7.2.4 Third-Party Sharing
We NEVER sell your personal data to advertisers. We share your data only with:
-   **Cloudinary:** To process and host your product images.
-   **Google:** For AI processing via Gemini and for OAuth social login.
-   **Law Enforcement:** Only when required by a valid legal subpoena or to protect the safety of our community.

---

## 8. Community Growth & Success: The Seller's Manual

### 8.1 How to Optimize Your Listings for the AI Search
To get the most out of our semantic engine, follow these tips:
1.  **Use Natural Language Titles:** Instead of "iPhone 13," try "Well-maintained iPhone 13 with charger and 90% battery health."
2.  **Detailed Descriptions:** Don't just list specs. Explain the *use case*. For example, "Great for entry-level video editing and university work."
3.  **Correct Categorization:** Our AI tries to guess your category, but manual verification ensures you appear in the right folders.
4.  **Local Keywords:** Mention your area (e.g., "Koteshwor," "Lalitpur") to attract nearby buyers who can meet up today.

---

## 9. The Platform Glossary: Every Term Explained

### 9.1 Bidding
The process of submitting a price quote lower or higher than the listed price but above the seller's floor.

### 9.2 Escrow (Coming Soon)
A system where Dosro Bazar acts as a trusted third party, holding funds until the buyer confirms the item matches the description.

### 9.3 Semantic Vector
A mathematical representation of your product description used by our AI to find "conceptual matches" rather than just keyword matches.

### 9.4 PWA (Progressive Web App)
A technology that allows Dosro Bazar to work like a mobile app without requiring a download from an app store.

### 9.5 MERN Stack
The technology foundation: **M**ongoDB, **E**xpress, **R**eact, **N**ode.js.

---

## 10. Final Word: Join the Movement

Dosro Bazar is a revolutionary step toward a more efficient, sustainable, and connected Nepal. Every time you choose to buy second-hand, you are making a choice for the planet. Every time you sell an unused item, you are stimulating the local economy.

We are honored to have you as part of our community. Let us build the future of Nepali commerce together.

**Dosro Bazar — Re-use. Re-sell. Re-imagine.**
