import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignInForm = () => {
    const { toast } = useToast();
    const { checkAuthUser, isLoading, isUserLoading } = useUserContext();

    const { mutateAsync: signInUserAccount, isPending: isSignInUserAccount } = useSignInAccount();

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        const session = await signInUserAccount({
            email: values.email,
            password: values.password
        });

        if (!session) return toast({ title: "Sign in fail, Please try again later!" });

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset()

            return navigate("/");
        } else {
            return toast({ title: "Sign up fail, Please try again later!" })
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="" />

                <h2 className="h3-bold md:h2-bold pt-5 ">Log in to your account</h2>
                <p className="text-light-3 small-medium md:base-regular">Welcome back, please enter your login details</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isSignInUserAccount ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : "Sign up"}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Don't have account?
                        <Link className="text-primary-500 text-small-semibold ml-1" to="/sign-up">Sign up</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignInForm