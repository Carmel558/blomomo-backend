# My NestJS App

This is a simple NestJS application that demonstrates the basic structure and functionality of a NestJS project.

## Project Structure

```
my-nestjs-app
├── src
│   ├── app.controller.ts       # Handles incoming requests and responses
│   ├── app.module.ts           # Root module of the application
│   ├── app.service.ts          # Contains business logic
│   ├── main.ts                 # Entry point of the application
│   └── common
│       └── filters
│           └── http-exception.filter.ts # Custom exception filter
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Installation

To install the dependencies, run:

```
npm install
```

## Running the Application

To start the application, use the following command:

```
npm run start
```

The application will be running on `http://localhost:3000`.

## API Endpoints

- `GET /` - Returns a greeting message.

## License

This project is licensed under the MIT License.