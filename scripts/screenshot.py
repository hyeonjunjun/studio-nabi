"""Take screenshots of the portfolio site for visual review."""
from playwright.sync_api import sync_playwright
import time
import os

URL = "http://localhost:3000"
OUT = "/tmp/hkj-screenshots"
os.makedirs(OUT, exist_ok=True)

TIMEOUT = 60000

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # 1. Homepage hero
    page.goto(URL, timeout=TIMEOUT, wait_until="domcontentloaded")
    time.sleep(5)
    page.screenshot(path=f"{OUT}/01-homepage-hero.png")
    print("1/10 homepage-hero")

    # 2. Scroll to projects
    page.evaluate("window.scrollTo(0, 700)")
    time.sleep(1.5)
    page.screenshot(path=f"{OUT}/02-homepage-projects.png")
    print("2/10 homepage-projects")

    # 3. Below fold
    page.evaluate("window.scrollTo(0, 1800)")
    time.sleep(1.5)
    page.screenshot(path=f"{OUT}/03-homepage-below.png")
    print("3/10 homepage-below")

    # 4. Full page
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(0.5)
    page.screenshot(path=f"{OUT}/04-homepage-full.png", full_page=True)
    print("4/10 homepage-full")

    # 5. Case study
    page.goto(f"{URL}/work/gyeol", timeout=TIMEOUT, wait_until="domcontentloaded")
    time.sleep(3)
    page.screenshot(path=f"{OUT}/05-casestudy.png")
    print("5/10 casestudy")

    # 6. Exploration
    page.goto(f"{URL}/exploration", timeout=TIMEOUT, wait_until="domcontentloaded")
    time.sleep(3)
    page.screenshot(path=f"{OUT}/06-exploration.png")
    print("6/10 exploration")

    # 7. Writing
    page.goto(f"{URL}/writing", timeout=TIMEOUT, wait_until="domcontentloaded")
    time.sleep(3)
    page.screenshot(path=f"{OUT}/07-writing.png")
    print("7/10 writing")

    # 8. About
    page.goto(f"{URL}/about", timeout=TIMEOUT, wait_until="domcontentloaded")
    time.sleep(3)
    page.screenshot(path=f"{OUT}/08-about.png")
    print("8/10 about")

    # 9. Mobile homepage
    mobile = browser.new_page(viewport={"width": 375, "height": 812})
    mobile.goto(URL, timeout=TIMEOUT, wait_until="domcontentloaded")
    time.sleep(5)
    mobile.screenshot(path=f"{OUT}/09-mobile-home.png")
    print("9/10 mobile-home")

    # 10. Mobile scroll
    mobile.evaluate("window.scrollTo(0, 500)")
    time.sleep(1.5)
    mobile.screenshot(path=f"{OUT}/10-mobile-scroll.png")
    print("10/10 mobile-scroll")

    mobile.close()
    page.close()
    browser.close()

print(f"\nDone! Screenshots in {OUT}/")
