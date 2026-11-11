import { expect, test } from '@playwright/test'

for (const path of ['/no-such-page', '/projects/no-such-project', '/projects']) {
  test(`unknown page ${path} redirects to the homepage`, async ({ page }) => {
    await page.goto(path)

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('main', { name: 'Board' })).toBeVisible()
  })
}

test('a known project page stays on its URL', async ({ page }) => {
  await page.goto('/projects/placeholder-project')

  await expect(page.getByRole('main', { name: 'Board' })).toBeVisible()
  await expect(page).toHaveURL('/projects/placeholder-project')
})
