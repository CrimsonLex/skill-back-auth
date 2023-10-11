import { Request, Response } from 'express';
import { registerCtrl, loginCtrl, checkSession } from './auth.controller';
import { registerNewUser, loginUser } from '../services/auth.service';
import * as authServices from '../services/auth.service';
import { RequestExt } from '../interfaces/request-extended.interfaces';
import { JwtPayload } from 'jsonwebtoken';


jest.mock('../services/auth.service');
const mockRequest = (userData: object): RequestExt => {
    return {
      user: userData,
    } as RequestExt;
  };

describe('authController', () => {
    describe('registerCtrl', () => {
      it('should return a response when registration is successful', async () => {
        const req = {} as Request; 
        req.body = { email: 'test@example.com', password: 'password', name: 'Test User' }; 
        
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as unknown as Response;
        
        (authServices.registerNewUser as jest.Mock).mockResolvedValue({
            _id: '123',
            email: 'test@example.com',
            name: 'Test User',
        });

        await registerCtrl(req, res);
        expect(res.status).toHaveBeenCalledWith(201); 
        expect(res.send).toHaveBeenCalledWith({
            _id: '123',
            email: 'test@example.com',
            name: 'Test User',
          });
        });
        it("should return a 400 status and 'ALREADY_USER' message when registration fails", async () => {
          const req: Request = {
              body: {
                  email: "existing@example.com",
                  password: "password123",
                  name: "Existing User",
              },
          } as Request;
          const res: Partial<Response> = {
              send: jest.fn(),
              status: jest.fn().mockReturnThis(),
          };
      
          (authServices.registerNewUser as jest.Mock).mockResolvedValue("ALREADY_USER");
          await registerCtrl(req, res as Response);
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.send).toHaveBeenCalledWith("ALREADY_USER");
      });
    });
    describe('loginCtrl', () => {
        it('should return a response when login is successful', async () => {
          const req = {
            body: { email: 'test@example.com', password: 'password' },
          } as Request;

          const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
          } as unknown as Response;

          (authServices.loginUser as jest.Mock).mockResolvedValue({
            token: 'yourAuthToken',
            user: {
              _id: '123',
              email: 'test@example.com',
              name: 'Test User',
            },
          });
          await loginCtrl(req, res);
          expect(res.status).toHaveBeenCalledWith(200); 
          expect(res.send).toHaveBeenCalledWith({
            token: 'yourAuthToken',
            user: {
              _id: '123',
              email: 'test@example.com',
              name: 'Test User',
            },
          });
        });
        it('should return a 401 response when login fails', async () => {
            const req = {
              body: { email: 'test@example.com', password: 'password' },
            } as Request;
      
            const res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            } as unknown as Response;
      
            (authServices.loginUser as jest.Mock).mockResolvedValue('AUTH_FAILED');
            await loginCtrl(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('AUTH_FAILED');
          });
    });
    
describe("checkSession", () => {
    it("should respond with the correct session data", async () => {
        const req: RequestExt = mockRequest({
          _id: "user123",
          email: "test@example.com",
          name: "Test User",
        });
        const res: Partial<Response> = {
          send: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
        await checkSession(req, res as Response); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
          data: "CORRECT_SESSION_CHECK",
          user: {
            _id: "user123",
            email: "test@example.com",
            name: "Test User",
          },
        });
      });
      it("should handle errors during session check", async () => {
    
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
          send: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
        await checkSession(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("ERROR_DURING_SESSION_CHECK");
      });
  });

});