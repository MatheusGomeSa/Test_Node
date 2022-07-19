import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateStatementDTO } from './ICreateStatementDTO';
import { CreateStatementError } from "./CreateStatementError"


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let user_id: string;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement Use Case", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
        const user = {
            name: "TestUser",
            email: "test@example.com",
            password: "testPassword"
        }
        const { id } = await createUserUseCase.execute(user);
        user_id = id;
    });
    it("Should be able to create a new statement", async () => {
        const statement: ICreateStatementDTO = {
            user_id,
            amount: 120.00,
            description: "Description",
            type: OperationType.DEPOSIT
        };

        const response = await createStatementUseCase.execute(statement);
        expect(response).toHaveProperty("id");
    });
    it("should not be able to create a new statement with wrong user id", () => {
        expect(async () => {
            const statement: ICreateStatementDTO = {
                user_id: "wrongUserId",
                amount: 120.00,
                description: "Description",
                type: OperationType.DEPOSIT
            };

            await createStatementUseCase.execute(statement);
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });
    it("should not be able to create a new statement with insufficient funds", () => {
        expect(async () => {
            const statement: ICreateStatementDTO = {
                user_id,
                amount: 120.00,
                description: "Description",
                type: OperationType.WITHDRAW
            };

            await createStatementUseCase.execute(statement);
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
    it("should be able to create a new statement with sufficient funds", async () => {

        await createStatementUseCase.execute({
            user_id,
            amount: 120.00,
            description: "description",
            type: OperationType.DEPOSIT
        });

        const statement: ICreateStatementDTO = {
            user_id,
            amount: 120.00,
            description: "Description",
            type: OperationType.WITHDRAW
        };
        const response = await createStatementUseCase.execute(statement);
        expect(response).toHaveProperty("id");

    });
})