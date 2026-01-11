import adminService from '../services/adminService.js';
import { SuccessResponse, ErrorResponseObject } from '../utils/responseHelper.js';

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await adminService.getAllComplaints();
    return res.status(200).json(SuccessResponse(complaints));
  } catch (err) {
    return res.status(500).json(ErrorResponseObject("Failed to retrieve complaints", err));
  }
};

export const getComplaintDetails = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const complaint = await adminService.getComplaintDetails(id);

    if (!complaint) {
      return res.status(404).json(ErrorResponseObject("Complaint not found"));
    }

    return res.status(200).json(SuccessResponse(complaint));
  } catch (err) {
    return res.status(500).json(ErrorResponseObject("Failed to retrieve complaint details", err));
  }
};

export const validateComplaint = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body;

    if (!status) return res.status(400).json(ErrorResponseObject("Status is required"));

    const result = await adminService.validateComplaint(id, status, notes || "");
    return res.status(200).json(SuccessResponse(result));
  } catch (err) {
    return res.status(400).json(ErrorResponseObject("Failed to validate complaint", err));
  }
};

export const respondToComplaint = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { notes } = req.body;

    if (!notes?.trim()) {
      return res.status(400).json(ErrorResponseObject("Response note cannot be empty"));
    }

    const result = await adminService.respondToComplaint(id, notes);
    return res.status(201).json(SuccessResponse(result));
  } catch (err) {
    return res.status(400).json(ErrorResponseObject("Failed to respond to complaint", err));
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await adminService.loginAdmin(username, password);

    if (!result) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(200).json(SuccessResponse({
      token: result.token,
      admin: result.admin
    }));

  } catch (err) {
    return res.status(500).json({ message: "Login error", error: err.message });
  }
};
