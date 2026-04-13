const bcrypt = require("bcryptjs");
bcrypt.compare("password123", "$2b$10$P0cXPGKM/UUG8IZlAcx3Le7ctLSpnhUKJ0uKcNYjxOxj86JE9Js0m").then(console.log);
bcrypt.compare("password123", "$2b$10$udbZJDjGvBTTwsVYqun8ceEVLBA1t2/cX1eEP4Bs5XSVQcDr/oJ2O").then(console.log);
