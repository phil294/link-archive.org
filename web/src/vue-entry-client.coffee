import Vue from 'vue'
import create_app from './vue-app'

{ app, store } = create_app()

if window.__INITIAL_STATE__
    store.replaceState window.__INITIAL_STATE__

app.$mount '#app'