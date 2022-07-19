import { GetBalanceUseCase } from './GetBalanceUseCase';
import { GetBalanceError } from './GetBalanceError';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let user_id: string;

describe("Get balance use case", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
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

    it("Should be able to get balance", async () => {

        const response = await getBalanceUseCase.execute({ user_id });

        expect(response).toHaveProperty("balance");
    });
    it("Should not be able to get balance with wrong user id", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({ user_id: "WrongUserId" });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
})