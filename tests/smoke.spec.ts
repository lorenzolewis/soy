import { expect, test } from '@playwright/test'

test('/ loads the empty whiteboard in the Four-Pack theme', async ({ page }) => {
  await page.goto('/')

  const board = page.getByRole('main', { name: 'Board' })
  await expect(board).toBeVisible()

  // The board is the Four-Pack canvas colour (--wb-canvas, #fafbfb) with its dot grid.
  const background = board.locator('.react-flow__background')
  await expect(background).toBeVisible()
  await expect(background).toHaveCSS('background-color', 'rgb(250, 251, 251)')
  await expect(background.locator('pattern circle')).toHaveCount(1)
})

test.describe('with the device in dark mode', () => {
  test.use({ colorScheme: 'dark' })

  test('/ loads the dark glass board', async ({ page }) => {
    await page.goto('/')

    const background = page.getByRole('main', { name: 'Board' }).locator('.react-flow__background')
    await expect(background).toBeVisible()
    // --wb-canvas in dark mode, #17191c
    await expect(background).toHaveCSS('background-color', 'rgb(23, 25, 28)')
  })
})
