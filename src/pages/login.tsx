import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  phoneNumber: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: "onChange",
  });
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { phoneNumber, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            phoneNumber,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <Helmet>
        <title>Admin | Login</title>
      </Helmet>
      <div className="bg-white w-full max-w-screen-sm py-5 rounded-lg text-center item-center">
        <h3 className=" text-3xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5 mb-3"
        >
          <input
            name="phoneNumber"
            ref={register({ required: "Phone number is required" })}
            placeholder="phoneNumber"
            className="input mb-3 py-3 px-2"
          />
          {errors.phoneNumber?.message && (
            <FormError errorMessage={errors.phoneNumber?.message} />
          )}
          <input
            name="password"
            type="password"
            ref={register({ required: "Password is required", minLength: 5 })}
            placeholder="password"
            className="input py-3 px-2"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 5 chars" />
          )}
          <Button
            canCLick={formState.isValid}
            loading={loading}
            actionText="Log In"
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          <Link to="/create-account" className="text-black hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
