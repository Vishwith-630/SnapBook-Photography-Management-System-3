# SnapBook – Photography Management System

A customer-facing photography booking website built for an FSD lab case study.

## Technology stack
- HTML5
- CSS3
- JavaScript
- jQuery 3.7.1
- AngularJS 1.8.2
- Browser LocalStorage
- FileReader API for image previews

## Run in VS Code
1. Extract `SnapBook-Photography-Management-System.zip`.
2. Open the extracted folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Use the Log in / Sign up buttons to create a customer account and test booking.

Internet access is required for the CDN libraries, Google Fonts and remote Unsplash sample images. For an offline demo, download local copies of these assets and update their paths.

## Customer workflow
1. Register or log in.
2. Choose a photography style.
3. Select a package.
4. Choose an available date and time slot.
5. Enter venue details.
6. Upload up to three reference images (maximum 500 KB each).
7. Review the booking.
8. Confirm the simulated advance payment.
9. Download the text receipt and view the booking in My Bookings.

## Demo data and storage
The app stores customers, the current session, bookings, contact messages and reviews in browser LocalStorage. To reset the demo, open browser Developer Tools → Application/Storage → Local Storage and remove keys beginning with `snapbook_`.

## Important limitations
- This is a frontend-only academic demonstration. LocalStorage is per browser/device and does not synchronize bookings between different customers/devices.
- Authentication is not secure. Passwords are stored locally for demonstration only. Never use real passwords or sensitive personal information.
- Payments are simulated. No UPI/card/bank transaction occurs.
- Custom packages are captured as an enquiry description, but the demo checkout requires one of the listed packages.
- Sample gallery images load from Unsplash and require an internet connection.

## Main modules
1. Customer registration and login
2. Home and dashboard
3. Photography styles and gallery
4. Date and time slot booking
5. Venue management
6. Photography packages
7. Reference image attachments
8. Simulated payment management
9. Booking confirmation and receipt
10. My bookings and cancellation
11. Customer-facing booking history
12. Contact, feedback, about and FAQs content

The admin dashboard is intentionally omitted because this version is the customer website only.

## Troubleshooting
If AngularJS template expressions appear literally (for example `{{vm.step}}`) or multiple booking steps appear at once, confirm that the CDN scripts loaded and check the browser Console. This corrected version initializes the booking model only after its functions are defined.
