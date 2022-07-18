import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { CreateUserError } from "./CreateUserError";
import { rejects } from "assert";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User UseCase", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {

        const user = {
            name: "TestUser",
            email: "test@example.com",
            password: "testPassword"
        }

        const response = await createUserUseCase.execute(user);

        expect(response).toHaveProperty("id");
    });
    it("should not be able to create a new user with same email", () => {
        expect(async () => {
            const user1 = {
                name: "TestUser1",
                email: "test@example.com",
                password: "testPassword"
            }
            await createUserUseCase.execute(user1);

            const user2 = {
                name: "TestUser2",
                email: "test@example.com",
                password: "testPassword"
            }
            const response = await createUserUseCase.execute(user2);
            console.log(response);

        }).rejects.toBeInstanceOf(CreateUserError);

    });
})
