import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Unique email for each run to avoid registration conflicts
        test_email = f"testuser_{int(time.time())}@example.com"
        test_password = "password123"

        await page.goto('file:///app/index.html')

        # 1. Verify reverted dashboard design (initial state)
        await page.wait_for_selector('.semester-card.locked') # Check if semesters are locked by default
        await page.screenshot(path='verification/11_reverted_dashboard.png')

        # 2. Open registration modal
        await page.click('#register-btn')
        await page.wait_for_selector('#auth-modal:not(.hidden)')
        await page.screenshot(path='verification/12_register_modal.png')

        # 3. Fill form and register
        await page.fill('#register-email', test_email)
        await page.fill('#register-password', test_password)
        await page.click('#register-submit-btn')

        # 4. Verify successful login state
        await page.wait_for_selector('#user-status:not(.hidden)')
        await asyncio.sleep(1) # Wait for UI update
        user_email_text = await page.inner_text('#user-email')
        assert user_email_text == test_email
        await page.screenshot(path='verification/13_logged_in_state.png')

        # 5. Logout
        await page.click('#logout-btn')
        await page.wait_for_selector('#auth-buttons:not(.hidden)')
        await asyncio.sleep(1)
        await page.screenshot(path='verification/14_logged_out_state.png')

        await browser.close()

asyncio.run(main())
