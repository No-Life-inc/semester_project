import { loginUser } from "../../services/userService";

const userTokens:string[] = [];

export const userSetup = async () => {
    const user1 = await loginUser("test_email@example.com", process.env.DEFAULT_PASSWORD);
    const user2 = await loginUser("test_password@example.com", process.env.DEFAULT_PASSWORD);
    const user3 = await loginUser("test@test.com", process.env.DEFAULT_PASSWORD);


    userTokens.push(user1.token);
    userTokens.push(user2.token);
    userTokens.push(user3.token);
}

export const getUserToken = (index: number) => {
    return userTokens[index];
}

export const teardownUserSetup = async () => {
    userTokens.splice(0, userTokens.length);
}


