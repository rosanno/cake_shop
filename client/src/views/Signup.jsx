import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

import Section from "../components/ui/Section";
import Button from "react-bootstrap/Button";
import usePublicRequest from "../hooks/usePublicRequest";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../features/authSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, fetchData } = usePublicRequest();
  const [validated, setValidated] = useState();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const data = {
          name,
          email,
          address,
          phone: phoneNumber,
          password,
        };

        if (password !== confirmPassword) {
          toast.error("Passwords do not match", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }

        const response = await fetchData("POST", "auth/register", data);
        if (response?.accessToken) {
          dispatch(setToken({ token: response.accessToken }));
        }
      } catch (error) {
        if (error?.response?.status === 401 || error?.response?.status === 404) {
          toast.error(`${error?.response?.data?.message}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <Section className="px-xl-5 mt-3 mt-md-5">
      <Container>
        <div>
          <h3 className="login-heading">Sign up</h3>
          <div className="divider my-3" />
          <div className="login-form mt-3 mt-lg-5">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  className="w-100 shadow-none py-lg-2"
                  onChange={(e) => setName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  required
                  type="text"
                  className="w-100 shadow-none py-lg-2"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Phone #</Form.Label>
                <Form.Control
                  required
                  type="number"
                  className="w-100 shadow-none py-lg-2"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an phone number.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  className="w-100 shadow-none py-lg-2"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  className="w-100 shadow-none py-lg-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  className="w-100 shadow-none py-lg-2"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Confirm password is required.
                </Form.Control.Feedback>
              </Form.Group>
              <div className="mt-4">
                <Button type="submit" variant="danger" className="w-100 py-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </Form>
            <div className="mt-3">
              <span className="redirect-label">
                Don&apos;t have account{" "}
                <Link to="/login" className="text-black">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Signup;
