# WeRent - Apartment Rental Platform (ServerSide)

Welcome to WeRent, the apartment rental platform where owners can advertise their apartments, 
and renters can explore reviews from previous tenants to make informed decisions.

By : Shani Yaish , Shiraz Sorijoun

## Introduction

WeRent is a web application designed to facilitate the rental process for both apartment owners and renters.
It focuses on transparency and trust by allowing renters to access reviews about apartments and owners from previous tenants who connected through our platform.

## Key Features

- **User Authentication :**
  - The server supports user authentication using industry-standard practices. It employs JSON Web Tokens (JWT) for secure authentication.

- **User Registration:**
  - A user registers with a unique email
  - Possibility of registration by an external provider

- **User Model:**
  - A user has one of the following roles:
     1. Admin (the creators of the site and those they give access to)
     2. Owners (those who want to advertise apartments for rent must register as apartment owners)
     3. Tenant
  - Each user has a personal profile with all the details on it, including the option to upload a photo from the server.

- **Advertising apartments for owners:**
  - You can advertise apartments and upload photos of the apartment from the server.
  - All apartment owners have a page where all the apartments they posted appear, where they can also edit their posts.

- **Testing:**
  - Test files for the API

----------------------
