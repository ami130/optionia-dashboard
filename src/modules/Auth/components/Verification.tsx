import { Col, Input, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { ErrorType, LoginTypes } from "../types/authTypes";
import "../styles/Login.css";
import { Form } from "../../../common/CommonAnt";
import { useLoginMutation } from "../api/loginEndpoint";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn, setMessage } from "../../../app/features/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TOKEN_NAME } from "../../../utilities/baseQuery";
import { openNotification } from "../../../app/features/notificationSlice";

import { RootState } from "../../../app/store";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import {  mainLogo, welcome } from "../../../utilities/images";

// const sharedProps: OTPProps = {
//   onChange,
//   onInput,
// };

const Verification: React.FC = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash = queryParams.get("hash");
  const { message } = useSelector((state: RootState) => state.auth);

  const from: string = location?.state?.from?.pathname || "/";

  useEffect(() => {
    if (hash) {
      const verifyEmail = async () => {
        try {
          const response = await axios.post(
            "https://code-canvas-official-app.onrender.com/auth/verify-email",
            {},
            {
              headers: {
                Authorization: `Bearer ${hash}`,
              },
            }
          );
          console.log("Verification successful:", response.data.data);
          if (response) {
            enqueueSnackbar(`Verification SuccessFully `, {
              variant: "success",
            });

            const { success }: any = response;
            dispatch(
              loggedIn({
                success,
                access: response?.data?.data?.access,
              })
            );
            localStorage.setItem(TOKEN_NAME, response?.data?.data?.access);
            // localStorage.setItem(
            //   TOKEN_NAME,
            //   JSON.stringify({
            //     success,
            //     access: response?.data?.data?.access,
            //   })
            // );
            dispatch(
              openNotification({
                type: "success",
                message: "You have successfully logged in.",
              })
            );
            navigate(from);
          }
        } catch (error) {
          console.error("Verification failed:", error);
          enqueueSnackbar(`Verification Unsuccessful `, {
            variant: "error",
          });
        }
      };

      verifyEmail();
    }
  }, [dispatch, from, hash, navigate]);

  const onFinish = async (values: LoginTypes): Promise<void> => {
    try {
      const response = await login(values).unwrap();
      if (response.success === true) {
        enqueueSnackbar(`Check Your mail for confirm the Login`, {
          variant: "success",
        });

        // const { success, data } = response;
        // dispatch(loggedIn({ success, access: data?.access }));
        // localStorage.setItem(
        //   TOKEN_NAME,
        //   JSON.stringify({ success, access: data?.access })
        // );
        // dispatch(
        //   openNotification({
        //     type: "success",
        //     message: "You have successfully logged in.",
        //   })
        // );
        // navigate(from);
      }
    } catch (error) {
      const { status } = error as ErrorType;
      if (status === "FETCH_ERROR") {
        dispatch(
          setMessage("We're sorry, our system is currently unavailable.")
        );
      }
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col span={24} lg={10} xs={24} className="bg-[#b8deff] h-screen">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
              textAlign: "center",
            }}
          >
            <div>
              <img
                src={mainLogo}
                alt="main logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />

              <div className=" bg-[#b8deff] w-[500px]">
                <Typography.Title
                  level={3}
                  style={{ margin: 0, display: "block" }}
                >
                  WelCome To Education
                </Typography.Title>
                <br />
                <Typography.Text type="secondary" style={{ display: "block" }}>
                  Login to you account below.
                </Typography.Text>
                <br />
                <Form
                  onFinish={onFinish}
                  buttonLabel="Login"
                  isLoading={isLoading}
                  className="form-field-body"
                >
                  <Form.Item<LoginTypes>
                    name="email"
                    rules={[{ required: true }]}
                  >
                    {/* <Input
                      onFocus={handleOnFocus}
                      prefix={<Iconify name="ph:user" />}
                      placeholder="e.g: some@example.com"
                    /> */}
                    <Input.OTP formatter={(str) => str.toUpperCase()} />
                  </Form.Item>
                </Form>

                <Link to="/send-otp">
                  <Typography.Link
                    style={{
                      display: "block",
                      textAlign: "right",
                      padding: "5px",
                    }}
                  >
                    Forgot Password?
                  </Typography.Link>
                </Link>
                <Typography.Text type="danger" style={{ display: "block" }}>
                  {message}
                </Typography.Text>
              </div>
            </div>
          </div>
        </Col>
        <Col span={24} lg={14} xs={0}>
          <img
            src={welcome}
            alt="main logo"
            style={{ width: "60%", height: "100%", objectFit: "contain" }}
            className="mx-auto"
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Verification;
