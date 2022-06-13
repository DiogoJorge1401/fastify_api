import { buildServer } from './app'

const app = buildServer()

;(async () => {
  try {
    await app.listen(3000, '0.0.0.0')
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
})()
