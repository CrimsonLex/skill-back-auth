import { registerNewUser, loginUser } from './auth.service';
import UserModel from '../models/user';
import * as bcryptHandle from '../utils/bcrypt.handle';
import * as jwtHandle from '../utils/jwt.handle';
import { encrypt, verified } from '../utils/bcrypt.handle';
import { User } from '../interfaces/user.interface';

jest.mock('../models/user', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../utils/bcrypt.handle', () => ({
  encrypt: jest.fn(),
  verified: jest.fn(),
}));

jest.mock('../utils/jwt.handle');


describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "ALREADY_USER" when user already exists', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

    const result = await registerNewUser({
      email: 'existing@example.com',
      password: 'password',
      name: 'Test User',
    });

    expect(result).toBe('ALREADY_USER');
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it('should create a new user and return it when user does not exist', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    (UserModel.create as jest.Mock).mockResolvedValue({
      _id: '123',
      email: 'new@example.com',
      name: 'Test User',
    });

    (encrypt as jest.Mock).mockResolvedValue('hashedPassword');

    const result = await registerNewUser({
      email: 'new@example.com',
      password: 'password',
      name: 'Test User',
    });
    //
    

    expect(result).toEqual({
      _id: '123',
      email: 'new@example.com',
      name: 'Test User',
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'new@example.com' });
    expect(encrypt).toHaveBeenCalledWith('password');
    expect(UserModel.create).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    });
  });

  it('should return "AUTH_FAILED" when user does not exist on the auth', async () => {
    const findOneMock = jest.spyOn(UserModel, 'findOne');
    findOneMock.mockResolvedValue(null);

    const result = await loginUser({ email: 'nonexistent@example.com', password: 'password' });

    expect(result).toBe('AUTH_FAILED');
    findOneMock.mockRestore();
  });

  it('should return "AUTH_FAILED" when password is incorrect on the auth', async () => {
    const findOneMock = jest.spyOn(UserModel, 'findOne');
    findOneMock.mockResolvedValue({ email: 'existing@example.com', password: 'hashedPassword' });

    const verifiedMock = jest.spyOn(bcryptHandle, 'verified');
    verifiedMock.mockResolvedValue(false);

    const result = await loginUser({ email: 'existing@example.com', password: 'wrongpassword' });

    expect(result).toBe('AUTH_FAILED');

    findOneMock.mockRestore();
    verifiedMock.mockRestore();
  });

  it('should return user data and token when login is successful', async () => {
    const findOneMock = jest.spyOn(UserModel, 'findOne');
    findOneMock.mockResolvedValue({ _id: '123', email: 'existing@example.com', password: 'hashedPassword' });

    const verifiedMock = jest.spyOn(bcryptHandle, 'verified');
    verifiedMock.mockResolvedValue(true);

    const generateTokenMock = jest.spyOn(jwtHandle, 'generateToken');
    generateTokenMock.mockReturnValue('token123');

    const result = await loginUser({ email: 'existing@example.com', password: 'password' });

    expect(result).toEqual({
      token: 'token123',
      user: { _id: '123', email: 'existing@example.com', password: 'hashedPassword' },
    });

    findOneMock.mockRestore();
    verifiedMock.mockRestore();
    generateTokenMock.mockRestore();
  });

});
