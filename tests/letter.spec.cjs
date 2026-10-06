const { test, expect } = require('@playwright/test');
const exactLetter = `Niyayesh,
in case nobody told you today, i love you so much, my friend.
this letter is just to make you feel a little better. no big speech, just a reminder that you’ve got me. and yeah.
i’ll get very upset—
no.
mad.
if you ever need any kinda support and don’t share it w me.
that’s what friends are for, dummy.
anyway. glad we’re friends. now stop keeping shit to yourself.
your hb, Arash.`;
const normalize = text => text.replace(/\s+/g, ' ').trim();

for (const [name, width, height] of [['small phone',320,568],['phone',390,844],['tablet',768,1024],['desktop',1440,900],['landscape phone',844,390]]) {
  test(`${name}: opens exact letter, fits viewport, and reopens`, async ({page}) => {
    await page.setViewportSize({width,height});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('#letter')).toBeHidden();
    await expect(page.getByRole('heading', {level:1})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('#open-button').click();
    await expect(page.locator('#letter')).toBeVisible();
    await expect(page.locator('.letter-paper')).toHaveCSS('opacity','1');
    expect(normalize(await page.locator('.letter-copy').innerText())).toBe(normalize(exactLetter));
    await expect(page.locator('#letter-title')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('#back-button').click();
    await expect(page.locator('#arrival')).toBeVisible();
    await expect(page.locator('#open-button')).toBeFocused();
    await page.locator('#envelope-trigger').click();
    await expect(page.locator('#letter')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('keyboard opens immediately and restores focus',async({page})=>{
  await page.goto('/');
  await page.locator('#open-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#letter-title')).toBeFocused();
  await page.locator('#back-button').press('Enter');
  await expect(page.locator('#open-button')).toBeFocused();
});

test('reduced motion and missing animation library preserve access',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/gsap.min.js',route=>route.abort());
  await page.goto('/');
  await page.locator('#open-button').click();
  await expect(page.locator('#letter')).toBeVisible();
  await page.locator('#back-button').click();
  await expect(page.locator('#arrival')).toBeVisible();
});

test('without JavaScript the anchor opens a readable letter',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  await page.locator('#open-button').click();
  await expect(page.locator('#letter-title')).toBeInViewport();
  expect(normalize(await page.locator('.letter-copy').innerText())).toBe(normalize(exactLetter));
  await context.close();
});

test('all page assets are local and load successfully',async({page})=>{
  const broken=[];const external=[];
  page.on('response',response=>{if(response.status()>=400)broken.push(response.url());});
  page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4173'))external.push(request.url());});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  expect(broken).toEqual([]);expect(external).toEqual([]);
});
