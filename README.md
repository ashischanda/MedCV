# MedCV
MedCV: An interactive visualization system for patient cohort identifications from medical claim dataset


We will upload all of our project codes and synthetic dataset after the final submission in the CIKM 2022 conference. 

Thank you for visiting our site.

### Explaining our MedCV software:
![Test Image 1.0](https://github.com/ashischanda/MedCV/blob/master/images/medcv_claim_data_example.png)
Figure: A sample medical claim data of a hospitalized patient

![Test Image 1.1](https://github.com/ashischanda/MedCV/blob/master/images/medcv_w2v_model.PNG)

Figure: Skip-gram model architecture is shown for a claim data [The claim code description is presented in a box where ICD-9 diagnosis and CPT codes are marked in black and blue colors, respectively.]

![Test Image 1.2](https://github.com/ashischanda/MedCV/blob/master/images/medcv_workflow.png)

Figure: The workflow of our proposed MedCV software

### Screenshot of MedCV software:
![Test Image 1](https://github.com/ashischanda/MedCV/blob/master/images/med_cover.png)

Figure: A screenshot of MedCV with four views: (a) Query view: user writes a query, such as a patient treatment or a medical code, (b): Table view: shows a ranked list of related medical codes based on two different metrics, (c) Projection view: displays medical code relationships in a 2D view responsive to user interaction, (d): Selected code view: keeps a record of medical codes selected by the user.

### Table view:
![Test Image 2](https://github.com/ashischanda/MedCV/blob/master/images/table_panel.png)
Figure: Showing table panel with code filtering option for "965" 

### Claim view with patient timeline:
![Test Image 3](https://github.com/ashischanda/MedCV/blob/master/images/claim%20view.png)
Figure: Claim view and patient view: Claim view shows 50 example claims for recently selected code by a user from table view; Patient view presents timeline for the selected claim from claim view. Here, user selects claim #48 from claim view and patient view shows the patient timeline of the selected claim #48 and highlights in blue circle. The ICD-9 diagnosis and CPT codes are marked with prefix "d_" and "h_", respectively.


## Citation
Please acknowledge the following work in papers or derivative software:

```
@inproceedings{chanda2022medcv,
  title={MedCV: An interactive visualization system for patient cohort identifications from medical claim dataset},
  author={Chanda, Ashis Kumar and Egleston, Brian L and Bai, Tian and Vucetic, Slobodan},
  booktitle={Proceedings of the 31st ACM International Conference on Information \& Knowledge Management},
  year={2022}
}

```
