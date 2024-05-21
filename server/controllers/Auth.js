import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // checking is a user already exists

  const q = "SELECT * FROM staff WHERE userName = ?";

  db.query(q, [req.body.userName], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const role = "NormalUser";
    const DateOfRegistration = new Date();

    const q =
      "INSERT INTO staff(`fullname`,`userName`,`role`,`JobRole`,`password`,`DateOfRegistration`,`Branch`,`company_id`) VALUES (?)";
    const values = [
      req.body.fullname,
      req.body.userName,
      role,
      req.body.JobRole,
      hash,
      DateOfRegistration,
      req.body.Branch,
      req.body.company_id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const BusinessRegistration = (req, res) => {
  // checking is a user already exists

  const q = "SELECT * FROM businessnames WHERE userName = ?";

  db.query(q, [req.body.userName], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const role = "Admin";
    const DateOfRegistration = new Date();

    const q =
      "INSERT INTO businessnames(`userName`,`password`,`businessName`,`yourMobile`,`yourLocation`,`numberBranches`,`DateOfRegistration`,`role`) VALUES (?)";
    const values = [
      req.body.userName,
      hash,
      req.body.businessName,
      req.body.yourMobile,
      req.body.yourLocation,
      req.body.numberBranches,
      DateOfRegistration,
      role,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const { userName, password, Branch,locationName } = req.body;

  const adminQuery = `SELECT * FROM Businesses WHERE userName = '${userName}'`;
  db.query(adminQuery, (err, adminResults) => {
    if (err) throw err;

    if (adminResults.length > 0) {
      const admin = adminResults[0];
      bcrypt.compare(password, admin.password, (bcryptErr, bcryptRes) => {
        if (bcryptErr) throw bcryptErr;
        if (bcryptRes) {
          const token = jwt.sign(
            {
              id: admin.id,
              role: admin.role,
              businessName: admin.businessName,
              service_type: admin.service_type
            }, 
            "12Logic12**",
            { expiresIn: '3h' }
          );
          res.json({ token });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      }); 
    } else {
      const userQuery = `SELECT * FROM staff WHERE userName = '${userName}'`;
      db.query(userQuery, (err, userResults) => {
        if (err) throw err;

        if (userResults.length > 0) {
          const user = userResults[0];
          let branchToSend = Branch; 
          let UserLocationName = locationName;
          if (!Branch) {
            const getBranchQuery = `SELECT Branch FROM staff WHERE userName = '${userName}'`;
            db.query(getBranchQuery, (branchErr, branchResults) => {
              if (branchErr) {
                res
                  .status(500)
                  .json({ error: "Error fetching current branch" });
              } else {
                if (branchResults.length > 0) {
                  branchToSend = branchResults[0].Branch; 
                }
              }
            });
          }
          const updateBranchQuery = `UPDATE staff SET Branch = '${branchToSend}',UserLocationName = '${UserLocationName}'  WHERE userName = '${userName}'`;
          db.query(updateBranchQuery, (updateErr, updateResult) => {
            if (updateErr) {
              res.status(500).json({ error: "Error updating Branch" });
            } else {
              bcrypt.compare(
                password,
                user.password,
                (bcryptErr, bcryptRes) => {
                  if (bcryptErr) throw bcryptErr;

                  if (bcryptRes) {
                    const token = jwt.sign(
                      {
                        id: user.id,
                        role: user.role,
                        JobRole: user.JobRole,
                        fullname: user.fullname,
                        userName: user.userName,
                        Branch: branchToSend,
                        company_name: user.company_name,
                        company_id: user.company_id,
                        shift_start_time: user.shift_start_time,
                        shift_end_time: user.shift_end_time,
                      },
                      "12Logic12**",
                      { expiresIn: '3h' }
                    );

                    res.json({ token });
                  } else {
                    res.status(401).json({ error: "Invalid password" });
                  }
                }
              );
            }
          });
        } else {
          res.status(401).json({ error: "User not found" });
        }
      });
    }
  });
};

// export const login = (req, res) => {
//   const { userName, password, Branch,locationName } = req.body;

//   const adminQuery = `SELECT * FROM Businesses WHERE userName = '${userName}'`;
//   db.query(adminQuery, (err, adminResults) => {
//     if (err) throw err;

//     if (adminResults.length > 0) {
//       const admin = adminResults[0];
//       bcrypt.compare(password, admin.password, (bcryptErr, bcryptRes) => {
//         if (bcryptErr) throw bcryptErr;
//         if (bcryptRes) {
//           const token = jwt.sign(
//             {
//               id: admin.id,
//               role: admin.role,
//               businessName: admin.businessName,
//               service_type: admin.service_type
//             }, 
//             "12Logic12**"
//           );
//           res.json({ token });
//         } else {
//           res.status(401).json({ error: "Invalid password" });
//         }
//       }); 
//     } else {
//       const userQuery = `SELECT * FROM users WHERE userName = '${userName}'`;
//       db.query(userQuery, (err, userResults) => {
//         if (err) throw err;

//         if (userResults.length > 0) {
//           const user = userResults[0];
//           let branchToSend = Branch; 
//           let UserLocationName = locationName;
//           if (!Branch) {
//             const getBranchQuery = `SELECT Branch FROM users WHERE userName = '${userName}'`;
//             db.query(getBranchQuery, (branchErr, branchResults) => {
//               if (branchErr) {
//                 res
//                   .status(500)
//                   .json({ error: "Error fetching current branch" });
//               } else {
//                 if (branchResults.length > 0) {
//                   branchToSend = branchResults[0].Branch; 
//                 }
//               }
//             });
//           }
//           const updateBranchQuery = `UPDATE users SET Branch = '${branchToSend}',locationName = '${UserLocationName}'  WHERE userName = '${userName}'`;
//           db.query(updateBranchQuery, (updateErr, updateResult) => {
//             if (updateErr) {
//               res.status(500).json({ error: "Error updating Branch" });
//             } else {
//               bcrypt.compare(
//                 password,
//                 user.password,
//                 (bcryptErr, bcryptRes) => {
//                   if (bcryptErr) throw bcryptErr;

//                   if (bcryptRes) {
//                     const token = jwt.sign(
//                       {
//                         id: user.id,
//                         role: user.role,
//                         JobRole: user.job_role,
//                         fullname: user.fullname,
//                         userName: user.userName,
//                         Branch: branchToSend,
//                         branch_id: user.branch_id,
//                         company_id: user.business_id,
//                         shift_start_time: user.shift_start_time,
//                         shift_end_time: user.shift_end_time,
//                       },
//                       "duka2024"
//                     );

//                     res.json({ token });
//                   } else {
//                     res.status(401).json({ error: "Invalid password" });
//                   }
//                 }
//               );
//             }
//           });
//         } else {
//           res.status(401).json({ error: "User not found" });
//         }
//       });
//     }
//   });
// };

export const logout = (req, res) => {};

export const StaffMembers = (req, res) => {
  const company_id = req.params.company_id;
  const q = "SELECT * FROM staff where company_id = ?";

  db.query(q, [company_id], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const Member = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM staff WHERE id = ?";
  db.query(q, id, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(result[0]);
  });
};

export const deleteuser = (req, res) => {
  const id = req.params.id;
  const sqlRemove = "DELETE FROM staff where id= ?";
  db.query(sqlRemove, id, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
};

export const updateUser = (req, res) => {
  const id = req.params.id;
  const fullname = req.body.fullname;
  const userName = req.body.userName;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const Branch = req.body.Branch;

  const sqlUpdate =
    "UPDATE staff SET fullname = ?,userName = ?,password = ?,Branch = ? where id= ?";
  db.query(sqlUpdate, [fullname, userName, hash, Branch, id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
};

export const AddBranch = (req, res) => {
  const BranchName = req.body.BranchName;
  const operations_desc = req.body.operations_desc;
  const pay_bill_number = req.body.pay_bill_number;
  const DateRegistered = new Date().toISOString().split("T")[0];
  const storeNumber = req.body.storeNumber;
  const company_id = req.body.company_id;

  const q =
    "INSERT INTO Branches (BranchName,operations_desc,pay_bill_number,DateRegistered,storeNumber,company_id) VALUES (?,?,?,?,?,?);";

  db.query(
    q,
    [
      BranchName,
      operations_desc,
      pay_bill_number,
      DateRegistered,
      storeNumber,
      company_id,
    ],
    (err, data) => {
      console.log(err);
    }
  ); 
};

export const LoginBranches = (req, res) => {
  const q = "SELECT * FROM Branches";

  db.query(q, (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const updateUserStartShift = (req, res) => {
  const id = req.params.id;
  const startShiftDatetime = req.body.startShiftDatetime;
  const shift_start_time = startShiftDatetime;

  const sqlUpdate = "UPDATE staff SET shift_start_time = ? where id= ?";
  db.query(sqlUpdate, [shift_start_time, id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
};

export const updateUserEndShift = (req, res) => {
  const id = req.params.id;
  const endShiftDatetime = req.body.endShiftDatetime;
  const shift_end_time = endShiftDatetime;

  const sqlUpdate = "UPDATE staff SET shift_end_time = ? WHERE id = ?";
  db.query(sqlUpdate, [shift_end_time, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating shift end time");
      return;
    }
    res.send(result);
  });
};
