import { app } from './app'

;(async () => {
  try {
    await app.listen(3000, '0.0.0.0')

    console.log('Server ready at http://localhost:3000')
  } catch (err) {
    console.error(err)

    process.exit(1)
  }
})()
