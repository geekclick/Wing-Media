# Wing

## Overview

Wing is an innovative social media web application designed to create a seamless and engaging experience for users who want to connect, share, and interact with their friends, family, and like-minded individuals. With a clean interface, intuitive features, and robust performance, Wing aims to be the go-to platform for meaningful online social interactions.

## Features

### User Profiles
- **Customizable Profiles:** Users can create and customize their profiles with photos, bio, and personal details.
<!-- - **Privacy Settings:** Advanced privacy options to control who can see your profile and posts. -->

### Posts and Interactions
- **Rich Media Sharing:** Share photos, videos, and links with your followers.
- **Likes and Comments:** Engage with posts by liking and commenting. 
<!-- - **Hashtags and Mentions:** Use hashtags to categorize posts and mentions to tag friends. -->

### Messaging
- **Direct Messaging:** Private conversations with friends and followers.
<!-- - **Group Chats:** Create group chats to stay connected with multiple friends at once. -->

### Discover
- **Explore Feed:** Discover new content and users based on your interests.
<!-- - **Trending Topics:** Stay updated with the latest trends and discussions. -->
- **User Recommendations:** Find new friends with similar interests.

### Notifications
- **Real-time Alerts:** Get notified instantly about new likes, comments, messages, and followers.
<!-- - **Customizable Notifications:** Choose which notifications you want to receive. -->

<!-- ### Security
- **Account Protection:** Two-factor authentication and encrypted data to ensure user security.
- **Report and Block:** Easily report and block users to maintain a safe community. -->

## Getting Started

### Installation

To get started with Wing, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/geekclick/Wing-Media
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd wing
   ```
3. **Navigate to the Client Directory:**
   ```bash
   cd client
   ```
4. **Install Dependencies:**
   ```bash
   npm install
   ```
5. **Start the Client Server:**
   ```bash
   npm run dev
   ```
6. **Navigate to the Server Directory:**
   ```bash
   cd server
   ```
7. **Install Dependencies:**
   ```bash
   npm install
   ```
8. **Start the Development Server:**
   ```bash
   npm run dev
   ```

### Configuration

Wing uses environment variables to manage configuration. Create a `.env` file in the root directory and add the following variables:

1. **Client Variables:**
   ```
   VITE_SERVER_URL=http://localhost:5000
   ```
2. **Server Variables:**
   ```
   JWT_KEY=your jwt secret key
   MONGO_URI=mongodb connection string
   PORT=5000
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your cloud name
   CLOUDINARY_API_KEY =your api key
   CLOUDINARY_API_SECRET =your api secret
   ```

## Contributing

We welcome contributions from the community! To contribute to Wing, follow these steps:

1. Fork the repository.
2. Create a new branch with your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of feature or fix"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request with a description of your changes.

## License

Wing is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

Visit - https://anujghom.vercel.app<br>
LinkedIn - https://www.linkedin.com/in/anujghom<br>
Twitter - https://x.com/anuj_3125<br>


---

Thank you for choosing Wing! We hope you enjoy using our app as much as we enjoyed building it. Happy connecting!