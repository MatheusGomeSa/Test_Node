import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authentication User UseCase", () => {

    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

        const user = {
            name: "TestUser",
            email: "test@example.com",
            password: "testPassword"
        }
        await createUserUseCase.execute(user);
    });

    it("should be able to login a user account with correct credentials", async () => {

        const credentials = {
            email: "test@example.com",
            password: "testPassword"
        }

        const response = await authenticateUserUseCase.execute(credentials);
        expect(response).toHaveProperty("token");
    });
    it("should not be able login a user account with wrong credentials", () => {
        expect(async () => {

            const wrongCredentials = {
                email: "Wrong@example.com",
                password: "WrongPassword"
            }
            await authenticateUserUseCase.execute(wrongCredentials);
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

    });
})
