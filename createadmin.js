import supabase from "./src/utils/supabase";


const createAdmin = async () => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "mohamedfathi0121@gmail.com",
    password: "12345678Mo@",
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating admin:", error);
  } else {
    console.log("✅ Admin created:", data.user.id);
  }
};

createAdmin();
