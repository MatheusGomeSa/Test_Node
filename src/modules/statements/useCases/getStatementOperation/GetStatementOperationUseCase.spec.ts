import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let user_id: string;
let statement_id: string;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get statement operation Use Case", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository, inMemoryStatementsRepository
        );
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository, inMemoryStatementsRepository
        );

        const user = {
            name: "TestUser",
            email: "test@example.com",
            password: "testPassword"
        }
        const { id } = await createUserUseCase.execute(user);
        user_id = id;

        const statements = await createStatementUseCase.execute({
            user_id,
            amount: 120.00,
            description: "description",
            type: OperationType.DEPOSIT
        });
        statement_id = statements.id;
    });

    it("should be able to get statement operation", async () => {

        const response = await getStatementOperationUseCase.execute({ user_id, statement_id });

        expect(response).toHaveProperty("id");

    });
    it("should not be able to get statement operation with wrong user id", async () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({ user_id: "WrongUserId", statement_id });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });
    it("should not be able to get statement operation with wrong statement id", async () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({ user_id, statement_id: "WrongStatementId" });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });

})