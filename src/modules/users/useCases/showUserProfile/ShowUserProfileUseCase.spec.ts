import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from './ShowUserProfileError'

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase
let user_id: string;

describe("Show User Profile Use Case", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(
            inMemoryUsersRepository
        );

        const user = {
            name: "TestUser",
            email: "test@example.com",
            password: "testPassword"
        }
        const { id } = await createUserUseCase.execute(user);
        user_id = id;

    })
    it("should show user profile send the user id", async () => {
        const response = await showUserProfileUseCase.execute(user_id);
        expect(response).toHaveProperty("name");
    });
    it("should not be able to show user profile send a wrong user id", async () => {
        expect(async () => {
            let wrong_user_id = "wrongUserId"

            await showUserProfileUseCase.execute(wrong_user_id);
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
})