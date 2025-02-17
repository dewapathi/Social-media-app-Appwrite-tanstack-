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
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignUpForm = () => {
    const { toast } = useToast();
    const { checkAuthUser, isLoading, isUserLoading } = useUserContext();

    const { mutateAsync: createUserAccount, isPending: isCreatingUserAccount } = useCreateUserAccount();
    const { mutateAsync: signInUserAccount, isPending: isSignInUserAccount } = useSignInAccount();

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        const newUser = await createUserAccount(values);

        if (!newUser) return toast({ title: "Sign up fail, Please try again later!" });

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

                <h2 className="h3-bold md:h2-bold pt-5 ">Create a new account</h2>
                <p className="text-light-3 small-medium md:base-regular">To use Snapgram, please enter your details</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                        {isCreatingUserAccount ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : "Sign up"}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have account?
                        <Link className="text-primary-500 text-small-semibold ml-1" to="/sign-in">Log in</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignUpForm