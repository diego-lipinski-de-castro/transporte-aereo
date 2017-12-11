import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function loadView (component) {
  try {
    return () => import(`./../views/${component}`)
  } catch (error) {
    console.log(error)
  }
}

function loadPage (component) {
  try {
    return () => import(`./../pages/${component.replace('.', '/')}`)
  } catch (error) {
    console.log(error)
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      meta: {
        title: 'login'
      },
      component: loadPage('Login')
    },
    {
      path: '/aib/',
      component: loadView('aib'),
      children: [
        {
          path: 'company/',
          meta: {
            title: 'companys',
            action: 'resource'
          },
          component: loadPage('company.index')
        },
        {
          path: 'flights/',
          meta: {
            title: 'flights'
          },
          component: loadPage('flights.index'),
          children: [
            {
              path: 'dashboard',
              meta: {
                title: 'flights',
                action: 'dashboard'
              },
              component: loadPage('flights._dashboard')
            },
            {
              path: 'new/',
              meta: {
                title: 'flights',
                action: 'new'
              },
              component: loadPage('flights._new')
            }
          ]
        }
      ]
    },
    {
      path: '/404',
      meta: {
        title: '404'
      },
      component: loadPage('NotFound')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

export default router
