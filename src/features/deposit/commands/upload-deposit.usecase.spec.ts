import { UploadDepositUseCase } from './upload-deposit.usecase';
import { InMemoryDepositRepository } from '../infrastructure/repositories/in-memory-deposit.repository';
import { Deposit } from '../domain/entities/deposit.entity';

describe('UploadDepositUseCase', () => {
  let depositRepository: InMemoryDepositRepository;
  let uploadDepositUseCase: UploadDepositUseCase;

  beforeEach(() => {
    // Initialize the in-memory repository and use case
    depositRepository = new InMemoryDepositRepository();
    uploadDepositUseCase = new UploadDepositUseCase(depositRepository);
  });

  it('should save a new deposit into the repository and return the created deposit entity', () => {
    // Arrange
    const depositData = {
      sender: '홍길동-1234',
      receiver: 'Receiver Name',
      amount: 50000,
      transferDate: new Date('2023-12-01T10:00:00'),
      depositBank: 'Test Bank',
      depositAccount: '123-456-789',
      withdrawalAccount: '987-654-321',
    };

    // Act
    const createdDeposit = uploadDepositUseCase.execute(depositData);

    // Assert
    const savedDeposits = depositRepository.findAll();

    // Verify that the deposit was saved in the repository
    expect(savedDeposits.length).toBe(1);
    expect(savedDeposits[0]).toEqual(createdDeposit);

    // Verify the returned entity
    expect(createdDeposit).toBeInstanceOf(Deposit);
    expect(createdDeposit.senderSig).toBe(depositData.sender);
    expect(createdDeposit.receiver).toBe(depositData.receiver);
    expect(createdDeposit.amount).toBe(depositData.amount);
    expect(createdDeposit.transferDate).toEqual(depositData.transferDate);
    expect(createdDeposit.depositBank).toBe(depositData.depositBank);
    expect(createdDeposit.depositAccount).toBe(depositData.depositAccount);
    expect(createdDeposit.withdrawalAccount).toBe(
      depositData.withdrawalAccount,
    );
  });

  it('should handle deposits with different data without overwriting existing ones', () => {
    // Arrange
    const depositData1 = {
      sender: '홍길동-1234',
      receiver: 'Receiver Name 1',
      amount: 50000,
      transferDate: new Date('2023-12-01T10:00:00'),
      depositBank: 'Test Bank 1',
      depositAccount: '123-456-789',
      withdrawalAccount: '987-654-321',
    };

    const depositData2 = {
      sender: '김철수-5678',
      receiver: 'Receiver Name 2',
      amount: 100000,
      transferDate: new Date('2023-12-02T11:00:00'),
      depositBank: 'Test Bank 2',
      depositAccount: '123-456-790',
      withdrawalAccount: '987-654-322',
    };

    // Act
    const createdDeposit1 = uploadDepositUseCase.execute(depositData1);
    const createdDeposit2 = uploadDepositUseCase.execute(depositData2);

    // Assert
    const savedDeposits = depositRepository.findAll();

    // Verify that both deposits are saved
    expect(savedDeposits.length).toBe(2);
    expect(savedDeposits).toContainEqual(createdDeposit1);
    expect(savedDeposits).toContainEqual(createdDeposit2);

    // Verify the properties of the second deposit
    expect(createdDeposit2.senderSig).toBe(depositData2.sender);
    expect(createdDeposit2.receiver).toBe(depositData2.receiver);
    expect(createdDeposit2.amount).toBe(depositData2.amount);
    expect(createdDeposit2.transferDate).toEqual(depositData2.transferDate);
    expect(createdDeposit2.depositBank).toBe(depositData2.depositBank);
    expect(createdDeposit2.depositAccount).toBe(depositData2.depositAccount);
    expect(createdDeposit2.withdrawalAccount).toBe(
      depositData2.withdrawalAccount,
    );
  });
});
