// Ensure the script runs only on Instagram profile pages
if (window.location.origin === 'https://www.instagram.com') {
    const isProfilePage = () => {
        const pathname = window.location.pathname;
        const profilePagePattern = /^\/[^/]+\/$/; // Pattern to match /{profile_id}/
        return profilePagePattern.test(pathname);
    };

    // Function to add the overlay to the profile picture
    const addOverlay = () => {
        // Get the pathname from the current URL
        let pathname = window.location.pathname.replace(/\//g, "");

        // Construct the selector string
        let selector = `img[alt*="${pathname}'s profile picture"]`;

        // Select the image element with an alt attribute containing the constructed string
        let image = document.querySelector(selector);

        // Check if the image was found and perform actions
        if (image) {
            // Check if the overlay already exists to avoid adding multiple overlays
            if (!image.parentElement.querySelector('.custom-overlay')) {
                // Create the overlay element
                let overlay = document.createElement('div');
                overlay.className = 'custom-overlay';
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                overlay.style.color = 'white';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.cursor = 'pointer';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s';
                overlay.innerHTML = `
                    <div style="display:flex;align-items:center:justify-content:center;text-align:center;padding:10px">
                        <p style="font-size:12px;font-weight:bold;">${pathname}'s Profile Picture</p>
                    </div>
                `;

                // Append the overlay to the image's parent element
                image.parentElement.style.position = 'relative';
                image.parentElement.appendChild(overlay);

                // Add hover effect to show the overlay
                image.parentElement.addEventListener('mouseover', () => {
                    overlay.style.opacity = '1';
                });

                image.parentElement.addEventListener('mouseout', () => {
                    overlay.style.opacity = '0';
                });

                // Add click event to open the image in a new tab
                overlay.addEventListener('click', () => {
                    window.open(image.src, '_blank');
                });
            }
        } else {
            console.log(`No image found with alt text containing ${pathname}'s profile picture.`);
        }
    };

    // Initialize the observer for DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                if (isProfilePage()) {
                    // Call the addOverlay function to check and add the overlay when necessary
                    addOverlay();
                }
            }
        });
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true, attributes: true };

    // Start observing the body for changes
    observer.observe(document.body, config);

    // Initial call to add overlay if the script runs after the page is already loaded
    if (isProfilePage()) {
        addOverlay();
    }
}
