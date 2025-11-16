import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto('file:///app/index.html')

        # 1. Open chat and verify welcome message
        await page.click('#chat-icon')
        await page.wait_for_selector('#chat-window:not(.hidden)')
        await asyncio.sleep(1) # Wait for animation
        await page.screenshot(path='verification/09_chatbot_welcome.png')

        # 2. Ask a question and get a response
        await page.fill('#chat-input', 'Qual a diferença entre Array e Lista Ligada?')
        await page.click('#send-chat-btn')

        # Wait for the "typing" indicator to appear and then disappear
        await page.wait_for_selector('.typing-indicator')
        await page.wait_for_selector('.typing-indicator', state='hidden')

        await asyncio.sleep(1) # Wait for AI message to render
        await page.screenshot(path='verification/10_chatbot_response.png')

        await browser.close()

asyncio.run(main())
