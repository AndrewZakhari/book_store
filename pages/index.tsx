import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import Login from '../components/Login'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className=''>
      <div>
        <Login />
        <main className='text-red-800'>
          <h1 className='text-red-800'>
          Main Page
          </h1>
        </main>
        <footer>
          Footer
        </footer>
      </div>
    </div> 
  )
}

export default Home
