const express = require('express')
const exphbars = require('express-handlebars')
const restaurantList = require('./restaurants.json')

const app = express()
const port = 3000

const model = {
  restaurantDetail(id) {
    const oneRestaurant = restaurantList.results.find(restaurant => {
      return Number(restaurant.id) === Number(id)
    })
    return oneRestaurant
  },

  searchRestaurant(word) {
    const foundResteraurants = restaurantList.results.filter(restaurent => {
      // searching name, name_en, and category match the keyword
      if (restaurent.name.trim().toLowerCase().includes(word) || restaurent.name_en.trim().toLowerCase().includes(word) || restaurent.category.trim().toLowerCase().includes(word)) {
        return restaurent
      }
    })

    return foundResteraurants
  }
}

const view = {
  renderRestaurants() {
    // render main.handlebars to {{{ body }}} of main.handlebars
    app.get('/', (req, res) => {
      res.render('index', { restaurants: restaurantList.results })
    })
  },

  renderRestaurantDetail() {
    // render detail of restaurant
    app.get('/restaurants/:restaurant_id', (req, res) => {
      const restaurantId = Number(req.params.restaurant_id)
      res.render('show', { restaurant: model.restaurantDetail(restaurantId) })
    })
  },

  renderSearchRestaurant() {
    // render search restaurants
    app.get('/search', (req, res) => {
      const keyword = req.query.keyword.trim().toLowerCase()
      res.render('index', { restaurants: model.searchRestaurant(keyword), keyword: keyword })
    })
  }
}

const controller = {
  handlebars() {
    // setting handlebars
    app.engine('handlebars', exphbars({ defaultLayout: 'main' }))
    app.set('view engine', 'handlebars')
  },

  cssJs() {
    // use css & js
    app.use(express.static('public'))
  },

  routerStatus() {
    // router listener
    app.listen(port, () => {
      console.log(`express is listening on localhost: ${port}`)
    })
  }
}


view.renderRestaurants()
view.renderRestaurantDetail()
view.renderSearchRestaurant()

controller.handlebars()
controller.cssJs()
controller.routerStatus()


